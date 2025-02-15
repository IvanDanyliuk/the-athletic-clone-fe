import { RequestHandler } from 'express';
import mongoose from 'mongoose';
import createHttpError from 'http-errors';
import MaterialModel from '../models/material';
import CompetitionModel from '../models/competition';
import ClubModel from '../models/club';
import UserModel from '../models/user';
import { deleteImage, getFilenameFromUrl, setQueryParams, updateImage, uploadImage } from '../util/helpers';
import { 
  CreateMaterialBody, GetAllMaterialsQuery, GetFilterValues, GetRecentMaterialsQuery, 
  GetSecondaryMaterialsQuery, SearchMaterials, UpdateMaterialBody 
} from '../types/materials';
import cloudinary from '../util/cloudinary';


export const getMaterials: RequestHandler<unknown, unknown, unknown, GetAllMaterialsQuery> = async (req, res, next) => {
  const { page, itemsPerPage, filterData, sortData } = req.query;

  const order = !sortData || sortData.order === 'desc' ? -1 : 1;
  const sortIndicator = sortData ? sortData.indicator : 'createdAt';
  const query = filterData ? setQueryParams(filterData) : {};

  try {
    const materials = await MaterialModel
      .find(query)
      .populate('author')
      .sort({ [sortIndicator]: order })
      .skip(+page * +itemsPerPage)
      .limit(+itemsPerPage)
      .exec();

    const materialsCount = await MaterialModel.countDocuments(query);

    res.status(200).json({ materials, materialsCount });
  } catch (error) {
    next(error);
  }
};

export const getMaterial: RequestHandler = async (req, res, next) => {
  const { id } = req.params;
  try {
    if(!mongoose.isValidObjectId(id)) {
      throw(createHttpError(400, 'Invalid material id'));
    }

    const material = await MaterialModel.findById(id).populate('author').exec();
    if(!material) {
      createHttpError(404, 'Material not found');
    }

    res.status(200).json(material);
  } catch (error) {
    next(error);
  }
};

export const getRecentMaterials: RequestHandler<unknown, unknown, unknown, GetRecentMaterialsQuery> = async (req, res, next) => {
  const { materialsNumber, materialTypes } = req.query;
  try {
    const materials = await MaterialModel.find({ type: { $in: materialTypes } }).populate('author').sort({ createdAt: -1 }).exec();
    
    if(!materials) {
      throw(createHttpError(400, 'Materials not found'));
    }

    const recentMaterials = materials.slice(0, materialsNumber);
    res.status(200).json(recentMaterials);
  } catch (error) {
    next(error)
  }
};

export const getHomepageSecondaryMaterials: RequestHandler<unknown, unknown, unknown, GetSecondaryMaterialsQuery> = async (req, res, next) => {
  const { topMaterialsNum, postsNum } = req.query;
  try {
    const topMaterials = await MaterialModel
      .find({ type: { $in: ['article', 'note'] } })
      .populate('author')
      .sort({ likes: -1 })
      .exec();

    const latestPosts = await MaterialModel
      .find({ type: { $in: ['post'] } })
      .populate('author')
      .sort({ createdAt: -1 })
      .exec();

    const mustReadArticle = await MaterialModel.findOne({ isMain: true }).populate('author');

    const availableLeagues = await CompetitionModel.find().exec();
    const leagues = availableLeagues.map(league => league.fullName);
    const totalLeagueMaterials = await MaterialModel
      .find({ 
        $and: [
          { type: { $in: ['article', 'note'] } },
          { labels: { $in: leagues } }
        ]
       });
       
    const leagueMaterials = leagues
      .map(leagueName => ({
        league: leagueName,
        logo: availableLeagues.find(item => item.fullName === leagueName)?.logoUrl,
        materials: totalLeagueMaterials.filter(material => material.labels.includes(leagueName))
      }))
      .filter(league => league.materials.length > 0)
      .sort((a, b) => b.materials.length - a.materials.length);

    res.status(200).json({
      topMaterials: topMaterials.slice(0, topMaterialsNum),
      latestPosts: latestPosts.slice(0, postsNum),
      mustRead: mustReadArticle,
      leagueMaterials
    });
  } catch (error) {
    next(error);
  }
};

export const getSearchValues: RequestHandler<unknown, unknown, unknown, GetFilterValues> = async (req, res, next) => {
  const { value } = req.query;
  try {
    const regex = new RegExp(value);
    const competitions = await CompetitionModel.find({ fullName: { $regex: regex, $options: 'i' } }).exec();
    const clubs = await ClubModel.find({ $or: [{ fullName: { $regex: regex, $options: 'i' } }, { commonName: { $regex: regex, $options: 'i' } }] }).exec();
    const authors = await UserModel.find({ $and: [{ role: 'author' }, { lastName: { $regex: regex, $options: 'i' } }] }).exec();

    const response = { competitions, clubs, authors };
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const searchMaterials: RequestHandler<unknown, unknown, unknown, SearchMaterials> = async (req, res, next) => {
  const { value, type, materialsNum } = req.query;

  const query = typeof value === 'string' ? 
    {
      $and: [
        {
          $or: [
            { labels: { $in: value } },
            { title: { $regex: new RegExp(value), $options: 'i' } },
          ]
        },
        { type }
      ]
    } : 
    {
      $and: [
        {
          $or: [
            { labels: { $in: value.filter(item => !mongoose.isValidObjectId(item)) } }, 
            { author: { $in: value.filter(item => mongoose.isValidObjectId(item)) } },
          ]
        },
        { type }
      ]
    };

  try {
    const materials = await MaterialModel
      .find(query)
      .populate('author')
      .sort({ createdAt: -1 })
      .exec();
    
    const response = materialsNum ? materials.slice(0, materialsNum) : materials;
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const createMaterial: RequestHandler<unknown, unknown, CreateMaterialBody, unknown> = async (req, res, next) => {
  const material = req.body;
  try {
    if(!material.content) {
      throw createHttpError(400, 'Material must have a text');
    }
    
    if(material.isMain) {
      const mainMaterial = await MaterialModel.find({ isMain: true }).exec();
      if(mainMaterial) {
        await MaterialModel.findByIdAndUpdate(mainMaterial, { ...mainMaterial, isMain: false });
      }
    }

    const image = await uploadImage(material.image!);

    const newMaterial = await MaterialModel.create({
      ...material,
      image
    });

    res.status(201).json(newMaterial);
  } catch (error) {
    next(error);
  }
};

export const updateMaterial: RequestHandler<unknown, unknown, UpdateMaterialBody, unknown> = async (req, res, next) => {
  const materialToUpdate = req.body;
  
  try {
    const currentMaterial = await MaterialModel.findById(materialToUpdate._id);

    if(!currentMaterial) {
      throw(createHttpError(400, `Cannot find a material with such ID: ${materialToUpdate._id}`));
    }

    if(!mongoose.isValidObjectId(materialToUpdate._id)) {
      throw(createHttpError(400, 'Invalid material id'));
    }

    if(!materialToUpdate.content) {
      throw createHttpError(400, 'Material must have a text');
    }

    const image = materialToUpdate && materialToUpdate.image && currentMaterial.image !== materialToUpdate.image ? 
      await updateImage(materialToUpdate.image, currentMaterial!.image!) : 
      currentMaterial.image;

    if(materialToUpdate.isMain) {
      const mainMaterial = await MaterialModel.find({ isMain: true }).exec();
      if(mainMaterial) {
        await MaterialModel.findByIdAndUpdate(mainMaterial, { ...mainMaterial, isMain: false, author: materialToUpdate.author._id, image });
      }
    }

    await MaterialModel.findByIdAndUpdate(materialToUpdate._id, { ...materialToUpdate, author: materialToUpdate.author._id, image });

    const updatedMaterial = await MaterialModel.findById(materialToUpdate._id).lean().exec();

    res.status(200).json(updatedMaterial);
  } catch (error) {
    next(error);
  }
};

export const deleteMaterial: RequestHandler = async (req, res, next) => {
  const { id } = req.query;
  
  try {
    if(!mongoose.isValidObjectId(id)) {
      throw(createHttpError(400, 'Invalid material id'));
    }

    const material = await MaterialModel.findById(id);
    if(material && material.image) {
      await deleteImage(material.image);
    }

    await MaterialModel.findByIdAndDelete(id);
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};
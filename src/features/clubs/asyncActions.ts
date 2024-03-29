import { createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../../app/api/api';
import { ClubModel } from '../../app/models/components';
import { IClub, IClubsRequestData } from './types';


export const createClub = createAsyncThunk(
  'clubs/createClub',
  async (clubData: ClubModel, thunkAPI) => {
    try {
      const { data } = await api.createClub(clubData);
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const getClubs = createAsyncThunk(
  'clubs/getAllClubs',
  async (requestData: IClubsRequestData, thunkAPI) => {
    const { page, itemsPerPage, filterData, sortData } = requestData;
    try {
      const { data } = await api.getClubs(page, itemsPerPage, filterData, sortData,);
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const getClubsByCountry = createAsyncThunk(
  'clubs/getClubsByCountry',
  async (country: string | undefined, thunkAPI) => {
    try {
      const { data } = await api.getClubsByCountry(country);
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const getClub = createAsyncThunk(
  'clubs/getClub',
  async (id: string, thunkAPI) => {
    try {
      const { data } = await api.getClub(id);
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const updateClub = createAsyncThunk(
  'clubs/updateClub',
  async (clubToUpdate: IClub, thunkAPI) => {
    try {
      const { data } = await api.updateClub(clubToUpdate);
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const deleteClub = createAsyncThunk(
  'clubs/deleteClubs',
  async (id: string, thunkAPI) => {
    try {
      await api.deleteClub(id)
      return id;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
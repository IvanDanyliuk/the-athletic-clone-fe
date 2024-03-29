import React from 'react';
import { Link } from 'react-router-dom';
import { Avatar, Divider, Grid, List, ListItem, Typography, styled } from '@mui/material';
import { v4 as uuid } from 'uuid';
import { IMaterial } from '../../../features/materials/types';
import MaterialSecondaryInfo from './MaterialSecondaryInfo';


interface IContentSectionMaterialsProps {
  materials: IMaterial[];
}

const MaterialLink = styled(Link)`
  width: 100%;
  text-decoration: none;
  color: #000000;
  transition: .5s;
  &:hover {
    color: #434343;
  }
`;

const TopImage = styled('img')`
  width: 100%;
`;

const TopMaterialTitle = styled(Typography)`
  margin: .5em 0;
  @media (max-width: 492px) {
    font-size: 1.5em;
    text-align: center;
  }
`;

const TopMaterialPreview = styled(Typography)`
  @media (max-width: 492px) {
    font-size: .8em;
    text-align: center;
  }
`;

const MaterialsList = styled(List)`
  padding: 0;
  @media (max-width: 900px) {
    margin-top: 2em;
  }
`;

const MaterialsListItem = styled(ListItem)`
  padding: 0;
`;

const SecondaryMaterialTitle = styled(Typography)`
  @media (max-width: 492px) {
    font-size: .9em;
  }
`;

const SecondayMaterialImage = styled(Avatar)`
  width: 100%;
  height: 4em;
`;


const ContentSectionMaterials: React.FC<IContentSectionMaterialsProps> = ({ materials }) => {
  return (
    <Grid container >
      <Grid item xs={12} md={6} sx={{ margin: 0 }}>
        <MaterialLink to={`/materials/${materials[0]._id}`}>
          <TopImage 
            src={materials[0].image} 
            alt={materials[0]._id} 
          />
          <TopMaterialTitle variant='h3_top_section'>
            {materials[0].title}
          </TopMaterialTitle>
          <TopMaterialPreview variant='subtitle1_custom'>
            {materials[0].preview}
          </TopMaterialPreview>
        </MaterialLink>
      </Grid>
      <Divider orientation='vertical' flexItem sx={{ margin: '0 1em' }} />
      <Grid item xs={12} md>
        <MaterialsList>
          {materials.slice(1, 6).map((material, i) => (
            <MaterialsListItem key={uuid()}>
              <MaterialLink to={`/materials/${material._id}`}>
                <Grid container spacing={3}>
                  <Grid item xs sx={{ display: 'flex' }}>
                    <SecondayMaterialImage 
                      src={material.image} 
                      alt={material._id} 
                      variant='square' 
                    />
                  </Grid>
                  <Grid item xs={9} md={10}>
                    <SecondaryMaterialTitle variant='h4_custom'>
                      {material.title}
                    </SecondaryMaterialTitle>
                    <MaterialSecondaryInfo 
                      author={`${material.author.firstName} ${material.author.lastName}`} 
                      commentsNum={material.comments.length} 
                    />
                  </Grid>
                </Grid>
                {i !== 4 && (
                  <Divider orientation='horizontal' flexItem sx={{ margin: '1em 0' }} />
                )}
              </MaterialLink>
            </MaterialsListItem>
          ))}
        </MaterialsList>
      </Grid>
    </Grid>
  );
};

export default ContentSectionMaterials;
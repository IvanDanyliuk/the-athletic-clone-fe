import React from 'react';
import { Link } from 'react-router-dom';
import { Avatar, Grid, Typography, styled } from '@mui/material';
import { IMaterial } from '../../../features/materials/types';


interface IPopularMaterialItemProp {
  index: number;
  data: IMaterial;
}

const LinkContainer = styled(Link)`
  width: 100%;
  text-decoration: none;
  color: #000000;
`;

const MaterialContainer = styled(Grid)`
  padding: 1em 0;
  display: flex;
  align-items: center;
`;

const Index = styled(Typography)`
  @media (max-width: 640px) {
    font-size: 1.5em;
  }
`;

const Title = styled(Typography)`
  @media (max-width: 492px) {
    margin-left: .5em;
    font-size: .9em;
  }
`;

const Image = styled(Avatar)`
  width: 100%;
  height: 4em;
`;


const PopularMaterialItem: React.FC<IPopularMaterialItemProp> = ({ index, data }) => {
  return (
    <LinkContainer to={`/materials/${data._id}`}>
      <MaterialContainer container spacing={3}>
        <Grid item xs={1}>
          <Index variant='h5_custom'>{index}</Index>
        </Grid>
        <Grid item xs={8} md={9}>
          <Title variant='body1_custom'>{data.title}</Title>
        </Grid>
        <Grid item xs={3} md={2}>
          <Image 
            src={data.image} 
            alt={data._id} 
            variant='square' 
          />
        </Grid>
      </MaterialContainer>
    </LinkContainer>
  );
};

export default PopularMaterialItem;
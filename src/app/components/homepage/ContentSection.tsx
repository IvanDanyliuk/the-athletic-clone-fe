import React from 'react';
import sc from 'styled-components';
import { 
  Avatar, Box, Divider, Grid, List, 
  ListItem, Typography, styled 
} from '@mui/material';
import { v4 as uuid } from 'uuid';
import { IContentSection } from '../../../features/content/types';
import MaterialSecondaryInfo from './MaterialSecondaryInfo';
import { Link } from 'react-router-dom';
import SkeletonLoader from '../ui/SkeletonLoader';


interface IContentSectionProps {
  data: IContentSection
}

const SectionTitle = styled(Typography)`
  margin-bottom: .8em;
`;

const Section = styled(Box)`
  background: #ffffff;
`;

const MaterialLink = styled(Link)`
  width: 100%;
  text-decoration: none;
  color: #000000;
  transition: .5s;
  &:hover {
    color: #434343;
  }
`;

const TopImage = sc.img`
  width: 100%;
`;

const TopMaterialTitle = styled(Typography)`
  margin: .5em 0;
`;

const MaterialsList = styled(List)`
  padding: 0;
`;

const MaterialsListItem = styled(ListItem)`
  padding: 0;
`;

const SecondayMaterialImage = styled(Avatar)`
  width: 100%;
  height: 4em;
`;


const ContentSection: React.FC<IContentSectionProps> = ({ data }) => {
  if(!data) {
    return <SkeletonLoader variant='section' />;
  } 

  return (
    <Section>
      <SectionTitle variant='h2'>{data.name}</SectionTitle>
      <Grid container >
        <Grid item xs={12} md={6} sx={{ margin: 0 }}>
          <MaterialLink to={`/materials/${data.materials[0]._id}`}>
            <TopImage 
              src={data.materials[0].image} 
              alt={data.materials[0]._id} 
            />
            <TopMaterialTitle variant='h3'>
              {data.materials[0].title}
            </TopMaterialTitle>
            <Typography variant='subtitle1'>
              {data.materials[0].preview}
            </Typography>
          </MaterialLink>
        </Grid>
        <Divider orientation='vertical' flexItem sx={{ margin: '0 1em' }} />
        <Grid item xs={12} md>
          <MaterialsList>
            {data.materials.slice(1, 6).map((material, i) => (
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
                      <Typography variant='h4'>
                        {material.title}
                      </Typography>
                      <MaterialSecondaryInfo 
                        author={material.author.name} 
                        views={material.views} 
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
    </Section>
  );
};

export default ContentSection;
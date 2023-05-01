import React from 'react';
import styled from '@mui/styled-engine-sc';
import { 
  Box, Typography, Divider, Chip, Button, Avatar, Grid, 
  Card, CardHeader, CardContent, CardActions, Icon 
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowTrendUp } from '@fortawesome/free-solid-svg-icons';
import Carousel from 'react-material-ui-carousel';
import { v4 as uuid } from 'uuid';
import { IMaterial } from '../../../features/materials/types';
import { divideArrayIntoChunks } from '../../utils/helpers';
import { ThumbUp, ThumbDown } from '@mui/icons-material';


interface IRealtimePostsProps {
  materials: IMaterial[]
}

const Title = styled(Typography)`
  font-family: 'Arvo', serif;
  font-weight: 700;
  font-size: 1.7em;
`;

const HeaderDivider = styled(Divider)`
  margin: 0 1em;
`;

const CustomChip = styled(Chip)`
  margin-right: 1em;
`;

const ChipIcon = styled('div')`
  width: 1.8em;
  height: 1.8em;
  display: flex;
  align-items: center;
  border: 1px solid #000000;
  border-radius: 1em;
  svg, p {
    display: block;
    margin: auto;
    font-size: .8em;
    color: #000000;
  }
`;

const LatestIcon = styled(Typography)`
  font-family: 'Arvo', serif;
  font-weight: 800;
  line-height: 1em;
`;


const RealtimePosts: React.FC<IRealtimePostsProps> = ({ materials }) => {
  if(materials.length < 1) {
    return <div>Loading...</div>
  }

  const dividedMaterials = divideArrayIntoChunks(materials!, 4);
  console.log(dividedMaterials)

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Title variant='inherit'>Real Time</Title>
        <HeaderDivider orientation='vertical' flexItem />
        <CustomChip 
          icon={
            <ChipIcon>
              <FontAwesomeIcon icon={faArrowTrendUp} />
            </ChipIcon>
          } 
          label='Trending' 
        />
        <CustomChip 
          icon={
            <ChipIcon>
              <LatestIcon variant='inherit'>A</LatestIcon>
            </ChipIcon>
          } 
          label='Latest' 
        />
      </Box>
      <Box>
        <Carousel
          indicators={false}
          autoPlay={false}
          sx={{ marginBottom: 0, padding: '1em 0' }}
        >
          {dividedMaterials.map(group => (
            <Grid key={uuid()} container spacing={3}>
              {group.map(post => (
                <Grid item xs={12} md={3}>
                  <Card key={uuid()} sx={{ height: '100%' }}>
                    <CardHeader
                      avatar={<Avatar src={post.author.photoUrl} />}
                      title={<Typography>{post.author.name}</Typography>}
                      subheader={`${post.author.organization}, ${post.author.position}`}
                    />
                    <CardContent>
                      <Typography>
                        {post.content.replace(/(<([^>]+)>)/ig, '')}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button>
                        <Icon component={ThumbUp} />
                      </Button>
                      <Button>
                        <Icon component={ThumbDown} />
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ))}
        </Carousel>
      </Box>
    </Box>
  );
};

export default RealtimePosts;
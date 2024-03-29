import React from 'react';
import { Link } from 'react-router-dom';
import Carousel from 'react-material-ui-carousel';
import styled from '@mui/styled-engine-sc';
import { 
  Box, Typography, Divider, Chip, Button, Avatar, Grid, 
  Card, CardHeader, CardContent, CardActions, Icon 
} from '@mui/material';
import { ChatBubbleOutline, ThumbUpOffAlt } from '@mui/icons-material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowTrendUp } from '@fortawesome/free-solid-svg-icons';
import { v4 as uuid } from 'uuid';
import { IMaterial } from '../../../features/materials/types';
import { divideArrayIntoChunks } from '../../utils/helpers';


interface IRealtimePostsProps {
  materials: IMaterial[];
}

const HeaderDivider = styled(Divider)`
  margin: 0 1em;
`;

const Title = styled(Typography)`
  @media (max-width: 640px) {
    font-size: 1.3em;
  }
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

const PostLink = styled(Link)`
  text-decoration: none;
  color: #000000;
`;

const LatestIcon = styled(Typography)`
  font-family: 'Arvo', serif;
  font-weight: 800;
  line-height: 1em;
`;

const ActionBtn = styled(Button)`
  svg {
    font-size: 1.2em;
    color: #000000;
  }
`;

const BtnLabel = styled(Typography)`
  margin-left: .5em;
  font-size: .9em;
  color: #000000;
`;


const RealtimePosts: React.FC<IRealtimePostsProps> = ({ materials }) => {
  const dividedMaterials = divideArrayIntoChunks(materials!, 4);
  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Title variant='h2_custom'>Real Time</Title>
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
              {group.map((post: IMaterial) => (
                <Grid key={uuid()} item xs={12} md={3}>
                  <PostLink to={`/posts/${post._id}`}>
                    <Card sx={{ height: '100%' }}>
                      <CardHeader
                        avatar={<Avatar src={post.author.userPhotoUrl} />}
                        title={<Typography variant='subtitle2'>{`${post.author.firstName} ${post.author.lastName}`}</Typography>}
                        subheader={`${post.author.organization}, ${post.author.position}`}
                      />
                      <CardContent>
                        <Typography variant='body2'>
                          {post.content.replace(/(<([^>]+)>)/ig, '')}
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <ActionBtn>
                          <Icon component={ThumbUpOffAlt} />
                          <BtnLabel>{post.likes.length}</BtnLabel>
                        </ActionBtn>
                        <ActionBtn>
                          <Icon component={ChatBubbleOutline} />
                          <BtnLabel>{post.comments ? post.comments.length : '0'}</BtnLabel>
                        </ActionBtn>
                      </CardActions>
                    </Card>
                  </PostLink>
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
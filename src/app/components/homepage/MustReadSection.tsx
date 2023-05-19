import React from 'react';
import { IMaterial } from '../../../features/materials/types';
import { Avatar, Box, Grid, Paper, Typography, styled } from '@mui/material';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';


interface IMustReadSectionProps {
  article: IMaterial
}

const SectionTitle = styled(Typography)`
  margin-bottom: .8em;
`;

const ArticleLink = styled(Link)`
  text-decoration: none;
  color: #000000;
`;

const ArticleContent = styled(Grid)`
  padding: 1em;
  height: auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const Image = styled('img')`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Date = styled(Typography)`
  color: #939393;
`;

const ArticleTitle = styled(Typography)`
  margin-bottom: 1em;
`;

const AuthorName = styled(Typography)`
  margin-left: .5em;
  font-size: .8em;
`;


const MustReadSection: React.FC<IMustReadSectionProps> = ({ article }) => {
  return (
    <>
      <SectionTitle variant='h2_custom'>Must Read</SectionTitle>
      <ArticleLink to={`/materials/${article._id}`}>
        <Paper>
          <Grid container sx={{position: 'relative' }}>
            <ArticleContent item xs={12} md={6}>
              <Date variant='caption'>
                {dayjs(article.publicationDate).subtract(1, 'day').format('DD/MM/YYYY')}
              </Date>
              <Box>
                <ArticleTitle variant='h3_top_section'>{article.title}</ArticleTitle>
                <Typography variant='subtitle1_custom'>{article.preview}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar src={article.author.photoUrl} alt={article.author.name} />
                <AuthorName variant='caption'>by {article.author.name}</AuthorName>
              </Box>
            </ArticleContent>
            <Grid item xs={12} md={6}>
              <Image src={article.image} alt={article._id} />
            </Grid>
          </Grid>
        </Paper>
      </ArticleLink>
    </>
  );
};

export default MustReadSection;
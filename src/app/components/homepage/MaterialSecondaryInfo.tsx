import React from 'react';
import sc from 'styled-components';
import { faComment } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Typography, styled } from '@mui/material';


interface IMaterialSecondaryInfoProps {
  author: string,
  views: number
}

const SecondaryInfo = sc.div`
  margin: 1em 0;
  display: flex;
  align-items: center;
  font-family: 'Roboto', sans-serif;
  font-size: .7em;
`;

const Author = styled(Typography)`
  margin-right: 1em;
`;

const Views = styled(Typography)`
  svg {
    margin-right: 5px;
  }
`;

const MaterialSecondaryInfo: React.FC<IMaterialSecondaryInfoProps> = ({ author, views }) => {
  return (
    <SecondaryInfo>
      <Author variant='inherit'>{author}</Author>
      <Views variant='inherit'>
        <FontAwesomeIcon icon={faComment} />
        {views}
      </Views>
    </SecondaryInfo>
  );
};

export default MaterialSecondaryInfo;
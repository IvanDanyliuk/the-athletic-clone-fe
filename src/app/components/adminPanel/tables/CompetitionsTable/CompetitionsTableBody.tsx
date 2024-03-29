import React from 'react';
import { useDispatch } from 'react-redux';
import { TableBody, TableCell, TableRow } from '@mui/material';
import { v4 as uuid } from 'uuid';
import dayjs from 'dayjs';
import { ICompetition } from '../../../../../features/competitions/types';
import { RowActionButtons, TableLink } from '../../ui/';
import { AppDispatch } from '../../../../../features/store';
import { deleteCompetition, getCompetitions } from '../../../../../features/competitions/asyncActions';
import { EssenseType } from '../../../../models/components';


interface ICompetitionsTableBodyProps {
  competitions: ICompetition[];
  page: number;
  itemsPerPage: number;
}


const CompetitionsTableBody: React.FC<ICompetitionsTableBodyProps> = ({ competitions, page, itemsPerPage }) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleCompetitionDelete = (id: string) => {
    dispatch(deleteCompetition(id));
    dispatch(getCompetitions({ page, itemsPerPage }));
  };

  return (
    <TableBody>
      {
        competitions.map(({ _id, fullName, type, country, createdAt }) => (
          <TableRow key={uuid()}>
            <TableCell>
              <TableLink url={`/competitions/${_id}`} label={fullName} />
            </TableCell>
            <TableCell>{country}</TableCell>
            <TableCell>{type}</TableCell>
            <TableCell>{dayjs(createdAt).format('DD/MM/YYYY')}</TableCell>
            <TableCell>
              <RowActionButtons 
                id={_id} 
                type={EssenseType.competitions}
                onDelete={() => handleCompetitionDelete(_id)} 
              />
            </TableCell>
          </TableRow>
        ))
      }
    </TableBody>
  );
};

export default CompetitionsTableBody;
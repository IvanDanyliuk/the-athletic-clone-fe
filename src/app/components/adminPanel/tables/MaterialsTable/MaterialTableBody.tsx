import React from 'react';
import { useDispatch } from 'react-redux';
import { TableBody, TableCell, TableRow } from '@mui/material';
import { v4 as uuid } from 'uuid';
import { IMaterial } from '../../../../../features/materials/types';
import RowActionButtons from './RowActionButtons';
import { AppDispatch } from '../../../../../features/store';
import { deleteMaterial } from '../../../../../features/materials/asyncActions';


interface IMaterialsTableBodyProps {
  materials: IMaterial[],
  page: number,
  itemsPerPage: number
}


const MaterialTableBody: React.FC<IMaterialsTableBodyProps> = ({ materials, page, itemsPerPage }) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleMaterialEdit = (id: string) => {
    console.log('Edit', id);
  };

  const handleMaterialDelete = (id: string) => {
    dispatch(deleteMaterial({ id, page, itemsPerPage }));
  };

  return (
    <TableBody>
      {
        materials.map(({ _id, title, labels, type, author, status, publicationDate }) => (
          <TableRow key={uuid()}>
            <TableCell>{title}</TableCell>
            <TableCell>{labels.length ? labels[0] : '-'}</TableCell>
            <TableCell>{type}</TableCell>
            <TableCell>{author.name}</TableCell>
            <TableCell>{status}</TableCell>
            <TableCell>{publicationDate}</TableCell>
            <TableCell>
              <RowActionButtons 
                onEdit={() => handleMaterialEdit(_id)} 
                onDelete={() => handleMaterialDelete(_id)} 
              />
            </TableCell>
          </TableRow>
        ))
      }
    </TableBody>
  );
};

export default MaterialTableBody;
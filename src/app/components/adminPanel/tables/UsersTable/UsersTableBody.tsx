import React from 'react';
import { useDispatch } from 'react-redux';
import { TableBody, TableCell, TableRow } from '@mui/material';
import { v4 as uuid } from 'uuid';
import { IUser } from '../../../../../features/users/types';
import RowActionButtons, { EssenseType } from '../../ui/RowActionButtons';
import { AppDispatch } from '../../../../../features/store';
import { deleteUser } from '../../../../../features/users/asyncActions';


interface IUserTableBodyProps {
  users: IUser[],
  page: number,
  itemsPerPage: number
}


const UserTableBody: React.FC<IUserTableBodyProps> = ({ users, page, itemsPerPage }) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleUserDelete = (id: string) => {
    dispatch(deleteUser({ id, page, itemsPerPage }));
  };

  return (
    <TableBody>
      {
        users.map(({ _id, firstName, lastName, location, organization, position, role, createdAt }) => (
          <TableRow key={uuid()}>
            <TableCell>{firstName ? firstName : '-'}</TableCell>
            <TableCell>{lastName ? lastName : '-'}</TableCell>
            <TableCell>{role}</TableCell>
            <TableCell>{organization}</TableCell>
            <TableCell>{position}</TableCell>
            <TableCell>{location}</TableCell>
            <TableCell>{createdAt}</TableCell>
            <TableCell>
              <RowActionButtons 
                id={_id} 
                type={EssenseType.users}
                onDelete={() => handleUserDelete(_id)} 
              />
            </TableCell>
          </TableRow>
        ))
      }
    </TableBody>
  );
};

export default UserTableBody;
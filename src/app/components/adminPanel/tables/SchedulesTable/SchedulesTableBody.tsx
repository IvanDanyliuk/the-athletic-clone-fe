import React from 'react';
import { useDispatch } from 'react-redux';
import { TableBody, TableCell, TableRow } from '@mui/material';
import { v4 as uuid } from 'uuid';
import dayjs from 'dayjs';
import { RowActionButtons } from '../../ui/';
import { AppDispatch } from '../../../../../features/store';
import { deleteSchedule, getSchedules } from '../../../../../features/schedules/asyncActions';
import { ISchedule } from '../../../../../features/schedules/types';
import { EssenseType } from '../../../../models/components';


interface ISchedulesTableBodyProps {
  schedules: ISchedule[];
  page: number;
  itemsPerPage: number;
}


const SchedulesTableBody: React.FC<ISchedulesTableBodyProps> = ({ schedules, page, itemsPerPage }) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleScheduleDelete = (id: string) => {
    dispatch(deleteSchedule(id));
    dispatch(getSchedules({ page, itemsPerPage }))
  };

  return (
    <TableBody>
      {
        schedules.map(({ _id, competition, season, createdAt }) => (
          <TableRow key={uuid()}>
            <TableCell>{competition.fullName}</TableCell>
            <TableCell>{competition.type}</TableCell>
            <TableCell>{competition.country}</TableCell>
            <TableCell>{competition.clubs.length}</TableCell>
            <TableCell>{season}</TableCell>
            <TableCell>{dayjs(createdAt).format('DD/MM/YYYY')}</TableCell>
            <TableCell>
              <RowActionButtons 
                id={_id!} 
                type={EssenseType.schedules}
                onDelete={() => handleScheduleDelete(_id!)} 
              />
            </TableCell>
          </TableRow>
        ))
      }
    </TableBody>
  );
};

export default SchedulesTableBody;
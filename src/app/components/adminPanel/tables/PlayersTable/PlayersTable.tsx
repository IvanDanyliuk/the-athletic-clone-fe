import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Paper, Table } from '@mui/material';
import PlayersTableHead from './PlayersTableHead';
import { AppDispatch } from '../../../../../features/store';
import { selectPlayersFilters, selectAllPlayers, selectPlayersCount, selectPlayersStatus, selectPlayersError } from '../../../../../features/players/selectors';
import { getPlayers } from '../../../../../features/players/asyncActions';
import PlayersTableBody from './PlayersTableBody';
import PlayersTableFooter from './PlayersTableFooter';
import BackdropLoader from '../../../ui/BackdropLoader';
import { IPlayersTableHeadCell, Order } from '../../../../../features/players/types';
import { clearError } from '../../../../../features/players/reducers';
import ErrorSnackbar from '../../../ui/ErrorSnackbar';


const PlayersTable: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const players = useSelector(selectAllPlayers);
  const pageCount = useSelector(selectPlayersCount);
  const filterData = useSelector(selectPlayersFilters);
  const status = useSelector(selectPlayersStatus);
  const error = useSelector(selectPlayersError);

  const [page, setPage] = useState<number>(0);
  const [activeCell, setActiveCell] = useState<IPlayersTableHeadCell | null>(null);
  const [isErrorSnackbarOpen, setIsErrorSnackbarOpen] = useState<boolean>(false);

  const handleDataSort = (data: IPlayersTableHeadCell) => {
    if(!activeCell || activeCell.sortKey !== data.sortKey) {
      setActiveCell({
        ...data,
        order: Order.desc
      });
    }
    if(activeCell?.sortKey === data.sortKey && activeCell?.order === Order.desc) {
      setActiveCell({
        ...data,
        order: Order.asc
      });
    }
    if(activeCell?.sortKey === data.sortKey && activeCell?.order === Order.asc) {
      setActiveCell({
        ...data,
        order: Order.desc
      });
    }
  };

  const handleCurrentPageChange = (e: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleErrorSnackbarClose = () => {
    setIsErrorSnackbarOpen(false);
    dispatch(clearError());
  };

  useEffect(() => {
    dispatch(getPlayers({
      page, 
      itemsPerPage: 10, 
      filterData: filterData,
      sortData: activeCell ? { 
        indicator: activeCell?.sortKey!, 
        order: activeCell?.order! 
        } : null
    }));
  }, [dispatch, page, activeCell, filterData]);

  useEffect(() => {
    if(error) {
      setIsErrorSnackbarOpen(true);
    }
  }, [error]);

  if(status === 'loading') {
    return (
      <BackdropLoader open={true} />
    );
  }

  return (
    <Paper sx={{ maxWidth: '100%', overflow: 'auto' }}>
      <Table stickyHeader>
        <PlayersTableHead 
          activeCell={activeCell} 
          onSort={handleDataSort} 
        />
        <PlayersTableBody 
          players={players} 
          page={page} 
          itemsPerPage={10}
        />
        <PlayersTableFooter 
          pageCount={pageCount} 
          page={page} 
          onPageChange={handleCurrentPageChange} 
        />
      </Table>
      <ErrorSnackbar
        isOpen={isErrorSnackbarOpen}
        message={error}
        onClose={handleErrorSnackbarClose}
      />
    </Paper>
  );
};

export default PlayersTable;
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Paper, Table } from '@mui/material';
import MaterialsTableHead from './MaterialsTableHead';
import { AppDispatch } from '../../../../../features/store';
import { selectFilters, selectMaterials, selectMaterialsCount, selectMaterialsError, selectMaterialsStatus } from '../../../../../features/materials/selectors';
import { getMaterials } from '../../../../../features/materials/asyncActions';
import MaterialTableBody from './MaterialsTableBody';
import MaterialsTableFooter from './MaterialsTableFooter';
import BackdropLoader from '../../../ui/BackdropLoader';
import { IMaterialsTableHeadCell, Order } from '../../../../../features/materials/types';
import ErrorSnackbar from '../../../ui/ErrorSnackbar';
import { clearError } from '../../../../../features/materials/reducers';


const MaterialsTable: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const materials = useSelector(selectMaterials);
  const pageCount = useSelector(selectMaterialsCount);
  const filterData = useSelector(selectFilters);
  const status = useSelector(selectMaterialsStatus);
  const error = useSelector(selectMaterialsError);

  const [page, setPage] = useState<number>(0);
  const [activeCell, setActiveCell] = useState<IMaterialsTableHeadCell | null>(null);
  const [isErrorSnackbarOpen, setIsErrorSnackbarOpen] = useState<boolean>(false);

  const handleDataSort = (data: IMaterialsTableHeadCell) => {
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
    dispatch(getMaterials({
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
        <MaterialsTableHead 
          activeCell={activeCell} 
          onSort={handleDataSort} 
        />
        <MaterialTableBody 
          materials={materials} 
          page={page} 
          itemsPerPage={10}
        />
        <MaterialsTableFooter 
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

export default MaterialsTable;
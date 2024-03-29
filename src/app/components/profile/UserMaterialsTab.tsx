import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Box, Icon, IconButton, Paper, Table, TableBody, TableCell, TableFooter, TableHead, 
  TablePagination, TableRow, TableSortLabel, styled 
} from '@mui/material';
import { Close, Edit } from '@mui/icons-material';
import dayjs from 'dayjs';
import { v4 as uuid } from 'uuid';
import { AppDispatch } from '../../../features/store';
import { 
  selectMaterials, selectMaterialsCount, 
  selectMaterialsError, selectMaterialsStatus 
} from '../../../features/materials/selectors';
import { IMaterialsTableHeadCell } from '../../../features/materials/types';
import { clearError } from '../../../features/materials/reducers';
import { deleteMaterial, getMaterials } from '../../../features/materials/asyncActions';
import { BackdropLoader, ErrorSnackbar } from '../ui';
import { selectUser } from '../../../features/users/selectors';
import { AddNewMaterialButtonMenu } from '../adminPanel/ui';
import { Order, StateStatus } from '../../../features/types';


const cells: IMaterialsTableHeadCell[] = [
  {
    title: 'Title', 
    isSortable: false
  },
  {
    title: 'Subject', 
    isSortable: true,
    sortKey: 'title',
    order: Order.asc
  },
  {
    title: 'Type', 
    isSortable: true,
    sortKey: 'type',
    order: Order.asc
  },
  {
    title: 'Author', 
    isSortable: true,
    sortKey: 'author',
    order: Order.asc
  },
  {
    title: 'Status', 
    isSortable: true,
    sortKey: 'status',
    order: Order.asc
  },
  {
    title: 'Publication Date', 
    isSortable: true,
    sortKey: 'publicationDate',
    order: Order.asc
  },
  {
    title: '', 
    isSortable: false,
    sortKey: 'actions',
    order: Order.asc
  }
];

const PageHeader = styled(Box)`
  margin-bottom: 1em;
  display: flex;
  justify-content: flex-end;
`;

const TableContainer = styled(Paper)`
  max-width: 100%;
  overflow: auto;
`;

const Cell = styled(TableCell)`
  @media (max-width: 640px) {
    font-size: .8em;
  }
`;

const MaterialsTablePagination = styled(TablePagination)`
  width: 100%;
`;

const ActionBtns = styled(Box)`
  display: flex;
`;

const EditLink = styled(Link)`
  text-decoration: none;
  color: #000000;
`;


const UserMaterialsTab: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const user = useSelector(selectUser);
  const materials = useSelector(selectMaterials);
  const pageCount = useSelector(selectMaterialsCount);
  const status = useSelector(selectMaterialsStatus);
  const error = useSelector(selectMaterialsError);

  const [page, setPage] = useState<number>(0);
  const [activeCell, setActiveCell] = useState<IMaterialsTableHeadCell | null>(null);
  const [isErrorSnackbarOpen, setIsErrorSnackbarOpen] = useState<boolean>(false);

  const navLinks = [
    { url: `/profile/${user?._id}/materials/create/article`, label: 'Article' },
    { url: `/profile/${user?._id}/materials/create/note`, label: 'Note' },
    { url: `/profile/${user?._id}/materials/create/post`, label: 'Realtime' }
  ];

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

  const handleMaterialDelete = (id: string) => {
    dispatch(deleteMaterial(id));
  };

  useEffect(() => {
    dispatch(getMaterials({
      page, 
      itemsPerPage: 10, 
      filterData: {
        author: user?._id!
      },
      sortData: activeCell ? { 
        indicator: activeCell?.sortKey!, 
        order: activeCell?.order! 
        } : null
    }));
  }, [dispatch, page, activeCell, user]);

  useEffect(() => {
    if(error) {
      setIsErrorSnackbarOpen(true);
    }
  }, [error]);

  if(!user) {
    navigate('/');
  }

  if(status === StateStatus.Loading) {
    return (
      <BackdropLoader open={true} />
    );
  }

  return (
    <>
      <PageHeader>
        <AddNewMaterialButtonMenu links={navLinks} />
      </PageHeader>
      <TableContainer>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {cells.map(cell => (
                <TableCell key={uuid()}>
                  {cell.isSortable ? (
                    <TableSortLabel 
                      active={activeCell?.sortKey === cell.sortKey}
                      direction={activeCell?.sortKey === cell.sortKey ? activeCell?.order : cell.order} 
                      onClick={() => handleDataSort(cell)}
                    >
                      {cell.title}
                    </TableSortLabel>
                  ) : (
                    <Box component='span'>{cell.title}</Box>
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {
              materials.map(material => {
                const { _id, title, labels, type, author, status, publicationDate } = material;
                return (
                  <TableRow data-testid='materialRow' key={uuid()}>
                    <Cell>{title ? title : '-'}</Cell>
                    <Cell>{labels.length ? labels[0] : '-'}</Cell>
                    <Cell>{type}</Cell>
                    <Cell>{`${author.firstName} ${author.lastName}`}</Cell>
                    <Cell>{status}</Cell>
                    <Cell>{dayjs(publicationDate).subtract(1, 'day').format('DD/MM/YYYY')}</Cell>
                    <Cell>
                      <ActionBtns>
                        <EditLink to={`/profile/${user?._id}/materials/edit/${_id}`}>
                          <IconButton>
                            <Icon component={Edit} />
                          </IconButton>
                        </EditLink>
                        <IconButton onClick={() => handleMaterialDelete(_id)}>
                          <Icon component={Close} />
                        </IconButton>
                      </ActionBtns>
                    </Cell>
                  </TableRow>
                );
              })
            }
          </TableBody>
          <TableFooter>
            <TableRow>
              <MaterialsTablePagination
                rowsPerPageOptions={[]}
                count={pageCount}
                rowsPerPage={10}
                page={page}
                onPageChange={handleCurrentPageChange}
              />
            </TableRow>
          </TableFooter>
        </Table>
        <ErrorSnackbar
          isOpen={isErrorSnackbarOpen}
          message={error}
          onClose={handleErrorSnackbarClose}
        />
      </TableContainer>
    </>
  );
};

export default UserMaterialsTab;
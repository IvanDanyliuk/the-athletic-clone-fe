import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, TableBody, TableCell, TableRow, styled } from '@mui/material';
import { v4 as uuid } from 'uuid';
import { IMaterial } from '../../../../../features/materials/types';
import RowActionButtons, { EssenseType } from '../../ui/RowActionButtons';
import { AppDispatch } from '../../../../../features/store';
import { deleteMaterial, updateMaterial } from '../../../../../features/materials/asyncActions';
import dayjs from 'dayjs';
import { selectContentModeStatus, selectMaterialsToContent } from '../../../../../features/content/selectors';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faXmark } from '@fortawesome/free-solid-svg-icons';
import { addMaterialToContent } from '../../../../../features/content/reducers';
import { useNavigate } from 'react-router-dom';


interface IMaterialsTableBodyProps {
  materials: IMaterial[],
  page: number,
  itemsPerPage: number
}

const AddBtn = styled(Button)`

`;


const MaterialTableBody: React.FC<IMaterialsTableBodyProps> = ({ materials, page, itemsPerPage }) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const isContentEditMode = useSelector(selectContentModeStatus);
  const selectedMaterials = useSelector(selectMaterialsToContent);

  const handleMaterialAddToContent = (id: string) => {
    dispatch(addMaterialToContent(id));
  };

  const handleSetMainArticle = (material: IMaterial) => {
    dispatch(updateMaterial({
      ...material,
      isMain: !material.isMain
    }));
    navigate('/admin/content')
  };

  const handleMaterialDelete = (id: string) => {
    dispatch(deleteMaterial({ id, page, itemsPerPage }));
  };

  return (
    <TableBody>
      {
        materials.map(material => {
          const { _id, title, labels, type, author, status, publicationDate } = material;
          return (
            <TableRow key={uuid()} sx={{ background: selectedMaterials.includes(_id) ? '#eeeeee' : '#ffffff' }}>
              <TableCell>{title ? title : '-'}</TableCell>
              <TableCell>{labels.length ? labels[0] : '-'}</TableCell>
              <TableCell>{type}</TableCell>
              <TableCell>{author.name}</TableCell>
              <TableCell>{status}</TableCell>
              <TableCell>{dayjs(publicationDate).subtract(1, 'day').format('DD/MM/YYYY')}</TableCell>
              <TableCell>
                {
                  isContentEditMode ? (
                    <AddBtn
                      data-testid='addBtn' 
                      onClick={() => handleMaterialAddToContent(_id)}>
                      <FontAwesomeIcon icon={selectedMaterials.includes(_id) ? faXmark : faPlus} />
                    </AddBtn>
                  ) : (
                    <RowActionButtons 
                      id={_id} 
                      type={EssenseType.materials} 
                      materialType={type}
                      onSetMainArticle={() => handleSetMainArticle(material)}
                      onDelete={() => handleMaterialDelete(_id)} 
                    />
                  )
                }
              </TableCell>
            </TableRow>
          );
        })
      }
    </TableBody>
  );
};

export default MaterialTableBody;
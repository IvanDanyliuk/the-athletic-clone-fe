import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { faFilter, faFilterCircleXmark, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, Button, Grid, IconButton, Snackbar, styled, Tooltip } from '@mui/material';
import dayjs from 'dayjs';
import { clearFilters, setFilters } from '../../../../features/users/reducers';
import { AppDispatch } from '../../../../features/store';
import { ControlledDatePicker, SelectField } from '../../ui/';
import { checkFilterTimeInterval } from '../../../utils/helpers';
import { IUserFiltersData, UserRoles } from '../../../../features/users/types';
import { selectUserLocations } from '../../../../features/users/selectors';
import { getUsers, getUsersLocations } from '../../../../features/users/asyncActions';


const Form = styled(Box)`
  margin-top: 20px;
`;

const FormRow = styled(Grid)`
  margin-bottom: 10px;
`;

const BtnWrapper = styled(Grid)`
  display: flex;
  justify-content: center;
  align-items: flex-end;
`;

const SubmitBtn = styled(Button)`
  width: 100%;
  height: 4em;
  svg {
    font-size: 1.5em;
  }
`;

const roles = [
  { label: 'Administrator', value: UserRoles.admin }, 
  { label: 'Author', value: UserRoles.author }, 
  { label: 'Reader', value: UserRoles.reader },
];


const UserFilters: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { register, handleSubmit, control, formState: { errors }, reset } = useForm<IUserFiltersData>();
  const [dateError, setDateError] = useState<string | null>(null);

  const locations = useSelector(selectUserLocations);
  const countries = locations.map(location => ({ label: location, value: location }));

  const sumbitFilterData = (data: any) => {
    const isDatesValid = checkFilterTimeInterval(data.dateFrom, data.dateTo, handleDateError);
    if(isDatesValid) {
      dispatch(setFilters({
        ...data,
        dateFrom: data.dateFrom ? dayjs(data.dateFrom).toISOString() : '',
        dateTo: data.dateTo ? dayjs(data.dateTo).toISOString() : '',
      }));
    }
  };

  const clearFilterData = () => {
    reset();
    dispatch(clearFilters());
    dispatch(getUsers({ page: 0, itemsPerPage: 10, filterData: null, sortData: null }));
  };

  const handleDateError = (value: string) => {
    setDateError(value);
  };

  const clearDateError = () => {
    setDateError('');
  };

  useEffect(() => {
    dispatch(getUsersLocations());
  }, []);

  const action = (
    <IconButton
      size="small"
      aria-label="close"
      color="inherit"
      onClick={clearDateError}
    >
      <FontAwesomeIcon icon={faXmark} />
    </IconButton>
  );

  return (
    <Form component='form' onSubmit={handleSubmit(sumbitFilterData)}>
      <FormRow container spacing={3}>
        <Grid item xs={12} md={4}>
          <SelectField 
            name='role'
            label='Role' 
            control={control}
            register={register}
            error={errors.role}
            defaultValue=''
            options={roles}
          />
        </Grid>
        <Grid item xs={12} md={2}>
          <ControlledDatePicker 
            name='dateFrom'
            label='From'
            control={control}
            register={register}
          />
        </Grid>
        <Grid item xs={12} md={2}>
          <ControlledDatePicker 
            name='dateTo'
            label='To'
            control={control}
            register={register}
          />
        </Grid>
        <Grid item xs={12} md={2}>
          <SelectField 
            name='location'
            label='Location' 
            control={control}
            register={register}
            error={errors.location}
            options={countries}
          />
        </Grid>
        <BtnWrapper item xs={12} md={1}>
          <Tooltip title='Find' placement='top' arrow>
            <SubmitBtn 
              data-testid='submitFilterDataBtn'
              type='submit' 
              variant='outlined'
            >
              <FontAwesomeIcon icon={faFilter} />
            </SubmitBtn>
          </Tooltip>
        </BtnWrapper>
        <BtnWrapper item xs={12} md={1}>
          <Tooltip title='Clear filters' placement='top' arrow>
            <SubmitBtn 
              data-testid='clearFilterDataBtn'
              type='button' 
              variant='outlined' 
              color='warning' 
              onClick={clearFilterData}
            >
              <FontAwesomeIcon icon={faFilterCircleXmark} />
            </SubmitBtn>
          </Tooltip>
        </BtnWrapper>
      </FormRow>
      <Snackbar
        open={Boolean(dateError)}
        autoHideDuration={6000}
        onClose={clearDateError}
        message={dateError}
        action={action}
      />
    </Form>
  );
};

export default UserFilters;
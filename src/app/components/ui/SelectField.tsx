import React from 'react';
import { Control, Controller, FieldError, RegisterOptions, UseFormRegister } from 'react-hook-form';
import { Box, InputLabel, MenuItem, Select, styled, Typography } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { v4 as uuid } from 'uuid';
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons';


interface ISelectFieldProps {
  name: string,
  label: string,
  control: Control<any>,
  register: UseFormRegister<any>,
  registerOptions?: RegisterOptions,
  error?: FieldError,
  options: {
    label: string,
    value: string
  }[],
  [x: string]: any,
}

const Wrapper = styled(Box)`

`;

const Label = styled(InputLabel)`
  margin-bottom: 5px;
  font-size: .9em;
  color: #000000;
`;

const SelectBody = styled(Select)`
  width: 100%;
`;

const ErrorMessage = styled(Box)`
  padding: 5px 0;
  display: flex;
  align-items: center;
  font-size: .7em;
  color: #cd2424;

  svg {
    margin-right: 5px;
  }
`;


const SelectField: React.FC<ISelectFieldProps> = ({ 
  name, 
  label, 
  control, 
  register, 
  registerOptions, 
  error, 
  options, 
  ...props 
}) => {
  return (
    <Wrapper>
      <Label htmlFor={name}>
        {label}
      </Label>
      <Controller
        name={name}
        defaultValue={options[0].value}
        control={control}
        render={({ field: { ref, ...rest } }) => (
          <SelectBody
            inputRef={ref}
            {...rest}
          >
            {options.map(({ label, value }) => (
              <MenuItem key={uuid()} value={value}>
                {label}
              </MenuItem>
            ))}
          </SelectBody>
        )}
      />
      <ErrorMessage>
        {error && (
          <>
            <FontAwesomeIcon icon={faCircleExclamation} />
            <Typography variant='inherit'>{error?.message}</Typography>
          </>
        )}
      </ErrorMessage>
    </Wrapper>
  );
};

export default SelectField;
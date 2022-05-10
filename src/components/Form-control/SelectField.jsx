/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-vars */
/* eslint-disable object-curly-newline */
import {
  FormControl,
  FormHelperText,
  InputLabel,
  NativeSelect,
  Box,
} from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';
import { Controller } from 'react-hook-form';
import { styled } from '@mui/system'
import { createTheme } from '@mui/material/styles';


const Select = styled(NativeSelect)(() => ({
  border: 'none',
  outline: 'none',
}))

const Error = styled('p')(({ theme }) => ({
  margin: theme.spacing(1, 1.75, 3, 1.75),
  fontSize: 12,
  color: '#F44336',
  fontFamily: '"Roboto", "Helvetica", "Arial", "sans-serif"',
}))

const SelectField = ({
  control,
  errors,
  label,
  name,
  values,
  onChange,
  disable,
}) => {

  let theme = createTheme();
  const isError = !!errors[name]?.message;

  const handleSelectChange = (e) => {
    if (!onChange) return;

    onChange(e.target.value);
  };

  return (
    <>
      <Box
        sx={
          isError
            ? {
              p: theme.spacing(1.2, 1.5),
              mt: theme.spacing(2),
              border: '0.5px solid #c4c4c4',
              borderRadius: 5,
              position: 'relative',
              borderColor: '#F44336',
              color: '#F44336',
            }
            : {
              p: theme.spacing(1.2, 1.5),
              mt: theme.spacing(2),
              border: '0.5px solid #c4c4c4',
              borderRadius: 5,
              position: 'relative',
            }
        }
      >
        <InputLabel
          sx={
            isError
              ? {
                position: 'absolute',
                top: theme.spacing(-1),
                left: '20px',            
                fontSize: 12,            
                padding: theme.spacing(0, 0.5),            
                backgroundColor: 'white',
                borderColor: '#F44336',
                color: '#F44336',
              }
              : {
                position: 'absolute',
                top: theme.spacing(-1),
                left: '20px',            
                fontSize: 12,            
                padding: theme.spacing(0, 0.5),            
                backgroundColor: 'white',
              }}
        >
          {label}
        </InputLabel>
        <FormControl disabled={disable} fullWidth error={!!errors[name]}>
          <Controller
            control={control}
            name={name}
            render={({ field }) => (
              <Select
                {...field}
                onChange={(e) => {
                  handleSelectChange(e);
                  field.onChange(e);
                }}
              >
                <option key="all" value="">
                  All
                </option>
                {values.map((x) => (
                  <option key={x.realname} value={x._id}>
                    {x.realname}
                  </option>
                ))}
              </Select>
            )}
          />
        </FormControl>
      </Box>
      <Error>{errors[name]?.message}</Error>
    </>
  );
}

SelectField.propTypes = {
  control: PropTypes.object,
  errors: PropTypes.object,
  onChange: PropTypes.func,

  values: PropTypes.array,
  label: PropTypes.string,
  name: PropTypes.string,
  disable: PropTypes.bool,
};

export default SelectField;

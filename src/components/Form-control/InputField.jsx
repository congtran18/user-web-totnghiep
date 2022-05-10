/* eslint-disable object-curly-newline */
import React from 'react';
import PropTypes from 'prop-types';
import { TextField } from '@mui/material';
import { Controller } from 'react-hook-form';

const InputField = ({ control, errors, label, name, type }) => {
  return (
    <>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <TextField
            {...field}
            fullWidth
            margin="normal"
            variant="outlined"
            label={label}
            type={type}
            error={!!errors[name]}
            helperText={errors[name]?.message}
          />
        )}
      />
    </>
  );
}

InputField.propTypes = {
  control: PropTypes.object,
  errors: PropTypes.object,

  label: PropTypes.string,
  name: PropTypes.string,
  type: PropTypes.string,
};

export default InputField;

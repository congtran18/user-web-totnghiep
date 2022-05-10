/* eslint-disable object-curly-newline */
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import React from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/dist/client/router';

const FilterByType = ({ items, label, onChange, type }) => {
  const router = useRouter();
  const { query } = router;
  const selectValue = query[type] || '';

  const handleChange = (event) => {
    if (!onChange) return;

    const newValue = event.target.value;

    onChange(newValue);
  };

  return (
    <FormControl size="small" sx = {{ minWidth: '10rem', mr: '0rem'}}>
      <InputLabel>{label}</InputLabel>
      <Select value={selectValue} onChange={handleChange}>
        <MenuItem value="">All</MenuItem>

        {items.map((x) => (
          // eslint-disable-next-line no-underscore-dangle
          <MenuItem key={x._id} value={x._id}>
            {x.realname}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

FilterByType.propTypes = {
  items: PropTypes.array,
  label: PropTypes.string,
  onChange: PropTypes.func,
  type: PropTypes.string,
};

export default FilterByType;

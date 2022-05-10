/* eslint-disable operator-linebreak */
/* eslint-disable no-underscore-dangle */
/* eslint-disable object-curly-newline */
import { FormControl } from '@mui/material';
import { InputLabel } from '@mui/material';
import { Select } from '@mui/material';
import { MenuItem } from '@mui/material';
import React from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/dist/client/router';

const FilterByCategory = ({ mainItems, label, onChange, category }) => {
  const router = useRouter();

  const { query } = router;
  const { type } = query;

  const typeIndex = mainItems.findIndex((x) => x._id === type);

  const subCategory = typeIndex > -1 ? mainItems[typeIndex].categoryProduct : [];

  const handleChange = (event) => {
    if (!onChange) return;

    onChange(event.target.value);
  };

  return (
    <FormControl  size="small" disabled={!type} sx = {{ minWidth: '10rem', mr: '2rem'}}>
      <InputLabel>{label}</InputLabel>
      <Select value={query[category] || ''} onChange={handleChange}>
        <MenuItem value="">All</MenuItem>

        {subCategory.length > 0 &&
          subCategory.map((x) => (
            <MenuItem key={x.realname} value={x._id}>
              {x.realname}
            </MenuItem>
          ))}
      </Select>
    </FormControl>
  );
}

FilterByCategory.propTypes = {
  mainItems: PropTypes.array,
  label: PropTypes.string,
  onChange: PropTypes.func,
  category: PropTypes.string,
};

export default FilterByCategory;

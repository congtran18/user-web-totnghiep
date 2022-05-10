/* eslint-disable object-curly-newline */
import PropTypes from 'prop-types';
import React from 'react';
import FilterByCategory from './FilterByCategory';
import FilterByType from './FilterByType';
import FilterSort from './FilterSort';

const FilterBy = ({ types, handleTypeSort, handleCategorySort, handleSort }) => {

  return (
    <>
      <FilterByType
        items={types}
        label="Loại"
        onChange={handleTypeSort}
        type="type"
      />
      <FilterByCategory
        mainItems={types}
        label="Danh mục"
        onChange={handleCategorySort}
        category="category"
      />
      <FilterSort
        label="Lọc theo giá"
        onChange={handleSort}
        sort="sort"
      />
    </>
  );
}


// FilterBy.propTypes = {
//   handleTypeSort: PropTypes.func,
//   handleCategorySort: PropTypes.func,
// };

export default FilterBy;

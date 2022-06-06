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

const items = [
    {realname: "Cũ nhất", _id: "old"},
]

const SortCourseHistory = ({  onChange, sort }) => {
    const router = useRouter();
    const { query } = router;
    const selectValue = query[sort] || '';

    const handleChange = (event) => {
        if (!onChange) return;

        const newValue = event.target.value;

        onChange(newValue);
    };

    return (
        <FormControl size="small" sx={{ minWidth: '10rem', mr: '2rem' }}>
            <InputLabel>Lọc buổi học</InputLabel>
            <Select value={selectValue} onChange={handleChange}>
                <MenuItem value="">Mặc định</MenuItem>

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

SortCourseHistory.propTypes = {
    onChange: PropTypes.func,
    type: PropTypes.string,
};

export default SortCourseHistory;

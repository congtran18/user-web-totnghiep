import { TextField, Box, Icon } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/dist/client/router';


export default function SearchCourseHistory({ onChange }) {
    const router = useRouter();
    const timestampRef = useRef(null);

    const { query } = router;
    const { name } = query;

    const handleChange = (event) => {
        const value = event.target.value.trim();
        const currentTimestamp = timestampRef.current;

        if (!onChange) return;

        if (currentTimestamp) {
            clearTimeout(currentTimestamp);
        }

        timestampRef.current = setTimeout(() => {
            const { length } = value;
            if (length > 2) {
                onChange(value);
            }

            if (length === 0) {
                onChange('');
            }
        }, 300);
    };

    return (
        <>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'right' }}>
                <TextField
                    defaultValue={name}
                    variant="outlined"
                    size="small"
                    style={{ width: '14rem' }}
                    placeholder="Tìm kiếm buổi học..."
                    onChange={handleChange}

                    InputProps={{
                        startAdornment: (
                            <SearchIcon sx={{ mr: 2, fontSize: "medium" }}>
                                Add
                            </SearchIcon>
                        ),
                    }}
                />
            </Box>
        </>
    );
}

SearchCourseHistory.propTypes = {
    onChange: PropTypes.func,
};

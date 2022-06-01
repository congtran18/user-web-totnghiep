/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-vars */
/* eslint-disable object-curly-newline */
import {
    FormControl,
    InputLabel,
    Box,
    Autocomplete,
    TextField,
} from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';
import { Controller } from 'react-hook-form';
import { styled } from '@mui/system'
import { createTheme } from '@mui/material/styles';


const Select = styled(Autocomplete)(() => ({
    border: 'none',
    outline: 'none',
}))

const CustomTextField = styled(TextField)(() => ({
    borderRadius: '20px',
}))

const Error = styled('p')(({ theme }) => ({
    margin: theme.spacing(1, 1.75, 3, 1.75),
    fontSize: 12,
    color: '#F44336',
    fontFamily: '"Roboto", "Helvetica", "Arial", "sans-serif"',
}))

const multipleOption = [
    'Business',
    'Retail',
    'Ecommerce',
    'Art',
    'life',
    'jokes'
]

const MultipleSelectField = ({
    control,
    errors,
    label,
    name,
    include
}) => {

    let theme = createTheme();
    const isError = !!errors[name]?.message;


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
                <FormControl fullWidth error={!!errors[name]}>
                    <Controller
                        control={control}
                        name={name}
                        render={({ field: { onChange } }) => (
                            <Select
                                // {...field}  
                                multiple
                                onChange={(_, data) => {
                                    onChange(data);
                                    return data;
                                }}
                                limitTags={2}
                                defaultValue={include}
                                id="tags-outlined"
                                options={multipleOption}
                                getOptionLabel={(option) => option}
                                // defaultValue={[multipleOption[13]]}
                                filterSelectedOptions
                                renderInput={(params) => (
                                    <CustomTextField
                                        {...params}
                                        label="All"
                                    />
                                )}
                            />
                        )}
                    />
                </FormControl>
            </Box>
            <Error>{errors[name]?.message}</Error>
        </>
    );
}

MultipleSelectField.propTypes = {
    control: PropTypes.object,
    errors: PropTypes.object,
    label: PropTypes.string,
    name: PropTypes.string,
    include: PropTypes.array,
};

export default MultipleSelectField;

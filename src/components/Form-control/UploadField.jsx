/* eslint-disable no-unused-vars */
/* eslint-disable object-curly-newline */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Button, IconButton, Grid } from '@mui/material';
import styled from "@emotion/styled/macro";
import { ImagePreview } from "app/components"

const imagePlaceholder = 'https://thumbs.dreamstime.com/b/no-thumbnail-image-placeholder-forums-blogs-websites-148010362.jpg';

const Error = styled('p')(({ theme }) => ({
  // margin: theme.spacing(1, 1.75, 3, 1.75),
  fontSize: 12,
  color: '#F44336',
  fontFamily: '"Roboto", "Helvetica", "Arial", "sans-serif"',
}))

const ImageBox = styled(Box)(() => ({
  position: 'relative',
  textAlign: 'center',
  width: '90%',
  maxWidth: 200,
  height: 200,
}))

const IconGroup = styled(Box)(() => ({
  position: 'absolute',
  top: '30%',
  left: '15%',
  transition: "all 0.5s ease-in-out",
  display: 'none',
}))

const Slide = styled(Box)(({ theme, image, name }) => ({
  position: 'absolute',
  width: '100%',
  height: 150,
  backgroundImage: `url(${image})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  resize: 'both',
  border: '1px solid #cccccc',
  borderRadius: '10%',
  top: 0,
  left: 0,
  '&:hover ': {
    filter: (image && image !== imagePlaceholder && name !== "mainImage") && 'brightness(0.5)',
    [`${IconGroup}`]: {
      display: (!image || image === imagePlaceholder || name === "mainImage") ? 'none' : 'flex',
    }
  },
}))

const CustomButton = styled(Box)(() => ({
  position: 'absolute',
  left: '30%',
  top: '154px'
  // textAlign: 'center'
}))

const isFile = input => 'File' in window && input instanceof File;

const UploadField = ({ control, errors, name, register, imageSource, value, index, setValue }) => {
  const [uploadImage, setUploadImage] = useState(imageSource || imagePlaceholder);
  const [image, setImage] = useState(null);
  const [showPreview, setShowPreview] = useState(false)

  const handleOpenPreview = () => {
    setShowPreview(true)
  }

  const handleDeleteImage = () => {
    setImage(null);
    setUploadImage(imagePlaceholder);
    if (imageSource) {
      setValue(`slideImage.${index}`, { data: "delete"})
    } else {
      setValue(`slideImage.${index}`, { data: null })
    }
  }

  useEffect(() => {
    if (value && value[0]) {
      if (isFile(value[0])) {
        setImage(URL.createObjectURL(value[0]));
      }
      return;
    }
    setImage(null);
  }, [value]);

  return (
    <>
      <ImagePreview
        openPreview={showPreview}
        setOpenPreview={setShowPreview}
        imgUrl={image || uploadImage}
      />
      <Grid sx={3}>
        <ImageBox textAlign='center'>
          <Slide image={image || uploadImage} name={name}>
            <IconGroup>
              <Button
                sx={{
                  "&:hover": {
                    backgroundColor: 'rgba(255,0,255,0.3)',
                  }
                }}
                onClick={handleOpenPreview}
              ><img src='https://cdn1.iconfinder.com/data/icons/modern-universal/32/icon-21-128.png' alt='edit' width='24' height='28' /></Button>
              <Button
                sx={{
                  "&:hover": {
                    backgroundColor: 'rgba(255,0,255,0.3)',
                  }
                }}
                onClick={handleDeleteImage}
              // onClick={handleOpenConfirm.bind(this, product._id, product.code, 1)}
              ><img src="https://cdn4.iconfinder.com/data/icons/email-2-2/32/Trash-Email-Bin-128.png" alt='delete' width='24' height='28' /></Button>

            </IconGroup></Slide>

          <label htmlFor={`icon-button-${name}`} style={{ cursor: "pointer" }}>
            <input
              {...register(name)}
              accept="image/*"
              type="file"
              id={`icon-button-${name}`}
              style={{ display: 'none' }}
              name={name}
            />
            <CustomButton>
              <Button variant="contained" component="span" size="small" >Chọn file</Button>
            </CustomButton>
          </label>
          <Error>{errors[name]?.message}</Error>
        </ImageBox>
      </Grid>
    </>

  );
}

UploadField.propTypes = {
  control: PropTypes.object,
  errors: PropTypes.object,
  register: PropTypes.any,
  value: PropTypes.any,

  name: PropTypes.string,
  imageSource: PropTypes.string,
};

export default UploadField;

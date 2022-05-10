import React from "react";
import Swiper from 'react-id-swiper';

const Slides = ({ children, params }) => {

    return <Swiper  {...params}>{children}</Swiper>
    
};

export default Slides
import React from "react";

import { Slide } from "@mui/material";

const SlideTransition = React.forwardRef(function Transition(
    props,
    ref
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default SlideTransition;

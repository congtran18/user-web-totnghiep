import React, { MutableRefObject, useState } from "react";

import { Box, Divider, TextField, Typography, Grid } from "@mui/material";
import DragHandleIcon from '@mui/icons-material/DragHandle';

import { Resizable } from "re-resizable";
import Draggable from "react-draggable";


const TranslateAudio = ({
    textTutorAudio,
    textTutorTranslate,
    translateStatus,
}) => {
    return (
        <Draggable handle="strong" bounds="parent">
            <Resizable
                defaultSize={{ width: translateStatus ? 0 : 600, height: "100vh" }}
                style={{
                    position: "absolute",
                    right: '30%',
                    top: '5%',
                    backgroundColor: "#fff",
                    borderRadius: 10,
                }}
                minWidth={translateStatus ? 0 : 600}
                minHeight={400}
                maxHeight={"80vh"}
                maxWidth={translateStatus ? 0 : 600}
            >
                <Box
                    sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        overflow: "hidden",
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            p: 1,
                        }}
                    >
                        <Typography>Phiên dịch</Typography>
                        <strong>
                            <DragHandleIcon sx={{ cursor: "move" }} />
                        </strong>
                    </Box>
                    <Divider />
                    <Grid container spacing={4}>
                        <Grid item xs={6}>
                            <Box sx={{ flexGrow: 1, overflowY: "scroll" }}>
                                {textTutorAudio.map((text, i) => (
                                    <div>{text}</div>
                                ))}
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box sx={{ flexGrow: 1, overflowY: "scroll" }}>
                                {textTutorTranslate.map((text, i) => (
                                    <div>{text}</div>
                                ))}
                            </Box>
                        </Grid>
                    </Grid>
                    <Divider />
                </Box>
            </Resizable>
        </Draggable >
    );
};

export default TranslateAudio;

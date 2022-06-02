import { Box, Typography } from "@mui/material";
import React from "react";

const Message = ({ message }) => {
    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: message.position === "right"
                ? "right"
                : "left", 
            }}
        >
            <Box
                sx={{
                    maxWidth: "50%",
                    bgcolor: "primary.main",
                    m: 1,
                    px: 2,
                    py:1,
                    borderRadius: 20,
                    display: 'flex',
                    flexWrap: 'wrap'
                }}
            >
                <Typography sx={{wordWrap: 'break-word'}} color='#fff'>{message.text}</Typography>
            </Box>
        </Box>
    );
};

export default Message;

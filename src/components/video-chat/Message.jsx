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
                    bgcolor: message.bgcolor,
                    m: 1,
                    px: 2,
                    py:1,
                    borderRadius: 5,
                    // display: 'flex',
                    // flexWrap: 'wrap',
                    // alignItems: 'center'
                }}
            >
                <Box sx={{wordWrap: "break-word"}} color={message.color}>{message.text}</Box>
            </Box>
        </Box>
    );
};

export default Message;

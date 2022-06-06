import React from "react";

import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Divider,
    Fab,
} from "@mui/material";
import PhoneDisabledIcon from '@mui/icons-material/PhoneDisabled';

import SlideTransition from "./SlideTransitionComp";

const CallingDialog = ({
    open,
    handleClose,
    onCancel,
}) => {
    const handleCancel = () =>{
        onCancel()
    }

    return (
        <Dialog
            open={open}
            TransitionComponent={SlideTransition}
            keepMounted
            onClose={handleClose}
            aria-describedby="alert-dialog-slide-description"
            sx={{ minWidth: 300 }}
            fullWidth
        >
            <DialogTitle>{`Đang gọi gia sư`}</DialogTitle>
            <Divider />
            <DialogContent>
                <DialogContentText id="alert-dialog-slide-description">
                    Đợi gia sư trả lời ...
                </DialogContentText>
            </DialogContent>
            <Divider />
            <DialogActions>
                <Fab
                    sx={{
                        bgcolor: "red",
                        ":hover": { bgcolor: "red", opacity: 0.7 },
                    }}
                    aria-label="add"
                    onClick={handleCancel}
                >
                    <PhoneDisabledIcon sx={{ color: "#fff" }} />
                </Fab>
            </DialogActions>
        </Dialog>
    );
};

export default CallingDialog;

import React, { useState } from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Divider,
    Fab,
    Slide,
} from "@mui/material";

import PhoneIcon from '@mui/icons-material/Phone';
import PhoneDisabledIcon from '@mui/icons-material/PhoneDisabled';

import SlideTransition from "./SlideTransitionComp";


const AcceptCallDialog = ({
    open,
    handleClose,
    onAccept,
    onReject,
    caller,
}) => {
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
            <DialogTitle>{`Có học viên muốn bắt đầu call`}</DialogTitle>
            <Divider />
            <DialogContent>
                <DialogContentText id="alert-dialog-slide-description">
                    {caller && caller.name
                        ? `${caller.name} đang gọi ...`
                        : `Some One is Calling`}
                </DialogContentText>
            </DialogContent>
            <Divider />
            <DialogActions>
                <Fab sx={{bgcolor: 'green', ':hover': {bgcolor: 'green', opacity: .7}}} aria-label="add" onClick={onAccept}>
                    <PhoneIcon sx={{color: '#fff'}} />
                </Fab>
                <Fab sx={{bgcolor: 'red', ':hover': {bgcolor: 'red', opacity: .7}}}  aria-label="add" onClick={onReject}>
                    <PhoneDisabledIcon sx={{color: '#fff'}}/>
                </Fab>     
            </DialogActions>
        </Dialog>
    );
};

export default AcceptCallDialog;

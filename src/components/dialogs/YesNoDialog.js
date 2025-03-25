import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function YesNoDialog({open, setOpen, title, description, action}) {

  const handleClose = (choice) => {
    console.log('User selected:', choice);
    choice === "yes" && action()
    setOpen(false);
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={() => handleClose('No')}
        aria-labelledby="yes-no-dialog-title"
        aria-describedby="yes-no-dialog-description"
      >
        <DialogTitle id="yes-no-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="yes-no-dialog-description">
            {description}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleClose('no')} color="primary">
            No
          </Button>
          <Button onClick={() => handleClose('yes')} color="primary" autoFocus>
            Si
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

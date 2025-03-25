import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

export default function CDialog({text, button=false, children, onClickAction, onSubmitAction}) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
    onClickAction()
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleFormSubmit = async(e) => {
    e.preventDefault()
    onSubmitAction(e)
    handleClose()
  };

  return (
    <div>
      {button===true && <Button variant="outlined" fullWidth onClick={handleClickOpen}>
        {text}
      </Button>}
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        PaperProps={{
          component: 'form',
          onSubmit: handleFormSubmit,
        }}
      >
        <DialogTitle>{text}</DialogTitle>
        <DialogContent >
          
          <div  className=' m-5'>
            {children}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleFormSubmit}>Aceptar</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

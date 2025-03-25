import { Alert, Snackbar } from '@mui/material';
import React from 'react';

export default function CSnackbar({ snackbar, setSnackbar }) {
  return (
    <Snackbar
      open={snackbar.open}
      onClose={() => setSnackbar({ ...snackbar, open: false })}
      autoHideDuration={2000}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <Alert
        severity={snackbar.severity}
        variant="filled"
        sx={{ width: '100%' }}
      >
        {snackbar.message}
      </Alert>
    </Snackbar>
  );
}

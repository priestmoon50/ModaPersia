// src/components/Notification.jsx
import React, { useEffect } from 'react';
import { Snackbar, Alert } from '@mui/material';

const Notification = ({ message, severity, duration = 6000 }) => {
  const [open, setOpen] = React.useState(true);

  useEffect(() => {
    if (message) {
      setOpen(true);
    }
  }, [message]);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  return (
    <Snackbar open={open} autoHideDuration={duration} onClose={handleClose}>
      <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  ); 
}; 

export default Notification;

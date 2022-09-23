import React, { useState } from 'react';

import { Alert, Snackbar, Typography } from '@mui/material';
import { SnackbarContext } from '../context';

const SnackbarProvider = ({ children }) => {
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('success');

  const setAlert = (message, severity) => {
    setMessage(message);
    setSeverity(severity);
    setShow(true);
  };

  return (
    <SnackbarContext.Provider value={{ setAlert }}>
      {children}
      <Snackbar
        open={show}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        autoHideDuration={3000}
        onClose={() => setShow(false)}
      >
        <Alert onClose={() => setShow(false)} severity={severity}>
          <Typography variant="body1">{message}</Typography>
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
};

export default SnackbarProvider;

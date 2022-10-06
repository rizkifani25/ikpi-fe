import { AddRounded } from '@mui/icons-material';
import { Box, Button, Grid, Toolbar } from '@mui/material';
import React from 'react';
import { readLoginResponse } from '../common/localstorage';

const UserView = () => {
  return (
    <>
      <Toolbar />
      <Grid container sx={{ mt: 2, mb: 4, p: 4 }}>
        {readLoginResponse().role_name === 'admin' && (
          <Box display="flex" flexDirection="row">
            <Button variant="contained" startIcon={<AddRounded />}>
              Tambah User Baru
            </Button>
          </Box>
        )}
      </Grid>
    </>
  );
};

export default UserView;

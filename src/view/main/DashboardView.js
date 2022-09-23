import { Grid, Toolbar, Typography } from '@mui/material';
import React from 'react';

const DashboardView = () => {
  return (
    <>
      <Toolbar />
      <Grid container sx={{ mt: 2, mb: 4, p: 4 }}>
        <Typography variant="h5">Dashboard View</Typography>
      </Grid>
    </>
  );
};

export default DashboardView;

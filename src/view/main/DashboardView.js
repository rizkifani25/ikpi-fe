import React from 'react';
import { FolderRounded } from '@mui/icons-material';
import { Box, Card, CardActionArea, CardHeader, Grid, Toolbar, Typography } from '@mui/material';
import { useNavigate } from 'react-router';
import { MOCK_CONTENT } from '../mocks';

const DashboardView = () => {
  const navigate = useNavigate();

  const handleNavigate = (section) => {
    navigate(`/lkpi/dashboard/main/${section}`, { replace: true });
  };

  return (
    <>
      <Toolbar />
      <Grid container sx={{ mt: 2, mb: 4, p: 4 }} spacing={2}>
        {MOCK_CONTENT.map((c, index) => {
          return (
            <Grid key={index} item xs={4}>
              <Card>
                <CardActionArea sx={{ height: '100%' }} onClick={() => handleNavigate(c.path)}>
                  <CardHeader
                    title={
                      <Box display="flex" flexDirection="row" alignItems="center">
                        <FolderRounded color="primary" fontSize="large" />
                        <Typography variant="h5" sx={{ ml: 2 }}>
                          {c.label}
                        </Typography>
                      </Box>
                    }
                  />
                </CardActionArea>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </>
  );
};

export default DashboardView;

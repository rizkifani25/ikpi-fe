import React from 'react';
import { Card, CardActionArea, CardContent, CardMedia, Grid, ThemeProvider, Toolbar, Typography } from '@mui/material';
import { useNavigate } from 'react-router';
import { MOCK_CONTENT } from '../mocks';
import theme from '../theme';

const fileBaseUrl = `${process.env.PUBLIC_URL}/assets/icon/`;

const DashboardView = () => {
  const navigate = useNavigate();

  const handleNavigate = (section) => {
    navigate(`/lkpi/dashboard/main/${section}`, { replace: true });
  };

  return (
    <>
      <ThemeProvider theme={theme}>
        <Toolbar />
        <Grid container sx={{ mt: 2, mb: 4, p: 4 }} spacing={2}>
          {MOCK_CONTENT.map((c, index) => {
            return (
              <Grid key={index} item xs={4}>
                <Card>
                  <CardActionArea onClick={() => handleNavigate(c.path)}>
                    <CardMedia
                      component="img"
                      height="200"
                      image={`${fileBaseUrl}${c.icon}`}
                      alt="icon"
                      sx={{ objectFit: 'contain', p: 2 }}
                    />
                    <CardContent sx={{ 'MuiCardContent-root': { backgroundColor: 'grey' } }}>
                      <Typography variant="body1" fontWeight="bold" textAlign="center" sx={{ ml: 2 }}>
                        {c.label}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </ThemeProvider>
    </>
  );
};

export default DashboardView;

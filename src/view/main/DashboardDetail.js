import React from 'react';
import { ArrowBackRounded, DownloadRounded } from '@mui/icons-material';
import { Box, Button, Card, CardActionArea, CardHeader, Grid, Toolbar, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router';
import { MOCK_CONTENT } from '../mocks';
import FileSaver from 'file-saver';

const DashboardDetail = () => {
  const navigate = useNavigate();
  const { section } = useParams();

  const handleButtonBack = () => {
    navigate('/lkpi/dashboard/main', { replace: true });
  };

  const fileBaseUrl = `${process.env.PUBLIC_URL}/assets/dashboard/`;

  const handleDownload = (filename) => {
    FileSaver.saveAs(`${fileBaseUrl}${filename}`, filename);
  };

  return (
    <>
      <Toolbar />
      <Grid container sx={{ mt: 2, mb: 4, p: 4 }} spacing={2}>
        <Grid item xs={3}>
          <Button variant="contained" startIcon={<ArrowBackRounded />} onClick={() => handleButtonBack()}>
            Kembali
          </Button>
        </Grid>
        <Grid item xs={12} sx={{ mt: 4 }}>
          <Typography variant="h5">{MOCK_CONTENT[section - 1].label}</Typography>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={2}>
            {MOCK_CONTENT[section - 1].file.map((f, index) => {
              return (
                <Grid key={index} item xs={12}>
                  <Card>
                    <CardActionArea sx={{ height: '100%' }} onClick={() => handleDownload(f.filename)}>
                      <CardHeader
                        title={
                          <Box display="flex" flexDirection="row" alignItems="center">
                            <DownloadRounded color="primary" fontSize="large" />
                            <Typography variant="h5" sx={{ ml: 2 }}>
                              {f.filename}
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
        </Grid>
      </Grid>
    </>
  );
};

export default DashboardDetail;

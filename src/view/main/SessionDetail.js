import { AddRounded, ArrowBackRounded } from '@mui/icons-material';
import { Button, Card, CardContent, CardHeader, CircularProgress, Grid, Toolbar, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';
import ReactQuill from 'react-quill';
import { useNavigate, useParams } from 'react-router';
import useSessionDetail from '../common/hooks/useSessionDetail';
import { convertDate } from '../common/utils';
import QuestionCard from './QuestionCard';

const SessionDetail = () => {
  const navigate = useNavigate();

  const { id } = useParams();

  const { isLoading, detailSession } = useSessionDetail(id);

  const handleButtonBack = () => {
    navigate('/lkpi/dashboard/session', { replace: true });
  };

  return (
    <>
      {console.log(detailSession)}
      <Toolbar />
      {isLoading && (
        <Box sx={{ maxWidth: 500, margin: '0 auto' }}>
          <Grid container direction="column" alignItems="center" justifyContent="center" sx={{ minHeight: '100vh' }}>
            <CircularProgress color="primary" />
          </Grid>
        </Box>
      )}
      {!isLoading && (
        <>
          <Grid container sx={{ mt: 2, mb: 4, p: 4 }} gap={4}>
            <Grid item xs={3}>
              <Button variant="contained" startIcon={<ArrowBackRounded />} onClick={() => handleButtonBack()}>
                Kembali
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Card elevation={3} sx={{ borderRadius: 3, border: 'dashed 1px #263238' }}>
                <CardHeader
                  title={detailSession.session_name}
                  subheader={`${convertDate(new Date(detailSession.start_time), 'dddd, DD MMMM YYYY')}`}
                />
                <CardContent>
                  <Typography variant="h5">Peraturan</Typography>
                  <ReactQuill theme="bubble" value={detailSession.session_rules} readOnly={true} />
                  <Grid container flexDirection="row" alignItems="center" justifyContent="space-between">
                    <Grid item>
                      <Typography variant="h5" sx={{ mt: 3 }}>
                        Daftar Pertanyaan
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Button
                        variant="contained"
                        startIcon={<AddRounded />}
                        onClick={() => console.log('tambah pertanyaan')}
                      >
                        Tambah Pertanyaan
                      </Button>
                    </Grid>
                  </Grid>
                  <>
                    <Grid container sx={{ mt: 3, width: '100%' }} gap={2}>
                      {detailSession.question &&
                        detailSession.question.map((q, index) => (
                          <Grid key={q.id} item xs={12} md={12} lg={2} sx={{ width: '100%' }}>
                            <QuestionCard number={index + 1} question={q} />
                          </Grid>
                        ))}
                    </Grid>
                  </>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </>
      )}
    </>
  );
};

export default SessionDetail;

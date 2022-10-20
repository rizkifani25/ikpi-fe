import { Card, CardActionArea, CircularProgress, Grid, Toolbar, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router';
import { URL_API_SESSION_GET_LIST } from '../common/constant';
import useSnackbar from '../common/hooks/useSnackbar';
import { readLoginResponse } from '../common/localstorage';
import SessionCard from './SessionCard';

const { default: axios } = require('axios');

const getSessions = async (data) => await axios.post(URL_API_SESSION_GET_LIST, data);

const ResultTest = () => {
  const navigate = useNavigate();
  const { setAlert } = useSnackbar();
  const [sessions, setSessions] = useState([]);

  const { isFetching, refetch } = useQuery(
    'adminSessions',
    () =>
      getSessions({
        user_id: readLoginResponse().role_name !== 'admin' ? readLoginResponse().id : null,
        is_result: true,
      }),
    {
      onSuccess: (response) => {
        setSessions(response.data.data);
      },
      onError: () => {
        setAlert('Terjadi kesalahan tidak terduga. Coba lagi nanti.', 'error');
      },
    }
  );

  const handleClickResult = (sData) => {
    if (readLoginResponse().role_name !== 'admin') {
      navigate(`/lkpi/dashboard/session/result?sid=${sData.id}&uid=${readLoginResponse().id}`, { replace: true });
    } else {
      navigate(`/lkpi/dashboard/session/result?sid=${sData.id}&uid=`, { replace: true });
    }
  };

  useEffect(() => {
    let subscribed = true;
    return () => {
      if (subscribed) {
        refetch();
        subscribed = false;
      }
    };
  }, []);

  return (
    <>
      <Toolbar />
      {isFetching && (
        <Box sx={{ maxWidth: 500, margin: '0 auto' }}>
          <Grid container direction="column" alignItems="center" justifyContent="center" sx={{ minHeight: '100vh' }}>
            <CircularProgress color="primary" />
          </Grid>
        </Box>
      )}
      {!isFetching && (
        <Grid container sx={{ mt: 2, mb: 4, p: 4 }}>
          <Grid item xs={12}>
            <Typography variant="h5">Hasil Sesi Test PT. IK Precision Indonesia</Typography>
          </Grid>
          <Grid container sx={{ mt: 3, width: '100%' }} spacing={1}>
            {sessions.map((session, index) => (
              <Grid key={index} item xs={12} md={12} lg={4}>
                <Card sx={{ width: '100%' }}>
                  <CardActionArea onClick={() => handleClickResult(session)}>
                    <SessionCard sessionData={session} />
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
      )}
    </>
  );
};

export default ResultTest;

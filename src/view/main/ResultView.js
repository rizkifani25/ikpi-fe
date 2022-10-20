import { ArrowBackRounded } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Toolbar,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { URL_API_GET_RESULT, URL_API_SESSION_DETAIL, URL_API_SESSION_DETAIL_USER } from '../common/constant';
import useSnackbar from '../common/hooks/useSnackbar';
import { readLoginResponse } from '../common/localstorage';
import { convertDate, getDifferentMinutes } from '../common/utils';

const { default: axios } = require('axios');

const handlePost = async (data) => await axios.post(data.url, data.data);

const ResultView = () => {
  const navigate = useNavigate();
  const { setAlert } = useSnackbar();
  const [searchParams, setSearchParams] = useSearchParams();

  const [detailSession, setDetailSession] = useState({});
  const [result, setResult] = useState([]);

  const { isFetching: loadingSession } = useQuery(
    'sessionDetail',
    () =>
      handlePost({
        url: readLoginResponse().role_name === 'user' ? URL_API_SESSION_DETAIL_USER : URL_API_SESSION_DETAIL,
        data: {
          id_session: searchParams.get('sid'),
          id_user: searchParams.get('uid'),
        },
      }),
    {
      onSuccess: (response) => {
        setDetailSession(response.data.data);
      },
      onError: () => {
        setAlert('Terjadi kesalahan tidak terduga. Coba lagi nanti.', 'error');
      },
    }
  );

  const { isFetching } = useQuery(
    'resultTest',
    () =>
      handlePost({
        url: URL_API_GET_RESULT,
        data: {
          id_session: searchParams.get('sid'),
          id_user: searchParams.get('uid'),
        },
      }),
    {
      onSuccess: (response) => {
        setResult(response.data.data);
      },
      onError: () => {
        setAlert('Terjadi kesalahan tidak terduga. Coba lagi nanti.', 'error');
      },
    }
  );

  return (
    <>
      <Toolbar />
      {isFetching && loadingSession && (
        <Box sx={{ maxWidth: 500, margin: '0 auto' }}>
          <Grid container direction="column" alignItems="center" justifyContent="center" sx={{ minHeight: '100vh' }}>
            <CircularProgress color="primary" />
          </Grid>
        </Box>
      )}
      {!isFetching && !loadingSession && (
        <Grid container display="flex" direction="row" spacing={3} sx={{ p: 4 }}>
          <Grid item xs={12}>
            <Typography variant="h5">Hasil Sesi Test PT. IK Precision Indonesia</Typography>
          </Grid>
          <Grid item xs={12}>
            <Card>
              <CardHeader
                title={detailSession.session_name}
                subheader={convertDate(detailSession.start_time, 'dddd, DD MMMM YYYY HH:mm')}
              ></CardHeader>
              <CardContent>
                <Grid display="flex" direction="row" container justifyContent="center" spacing={5}>
                  <Grid item xs={12}>
                    <Typography variant="h5" textAlign="center">
                      {`Kuis ini ditutup pada hari ${convertDate(detailSession.end_time, 'dddd, DD MMMM YYYY HH:mm')}`}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="h5" textAlign="center">
                      {`Batas Waktu : ${getDifferentMinutes(detailSession.start_time, detailSession.end_time)} menit`}
                    </Typography>
                  </Grid>
                  <Grid item xs="auto">
                    <TableContainer component={Paper}>
                      <Table stickyHeader sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                          <TableRow>
                            <TableCell sx={{ borderBottom: '2px solid black', fontWeight: 'bold' }}>No.</TableCell>
                            <TableCell align="center" sx={{ borderBottom: '2px solid black', fontWeight: 'bold' }}>
                              Nama Lengkap
                            </TableCell>
                            <TableCell align="center" sx={{ borderBottom: '2px solid black', fontWeight: 'bold' }}>
                              Waktu Submit
                            </TableCell>
                            <TableCell align="center" sx={{ borderBottom: '2px solid black', fontWeight: 'bold' }}>
                              Nilai (100.00)
                            </TableCell>
                            <TableCell align="center" sx={{ borderBottom: '2px solid black', fontWeight: 'bold' }}>
                              Pendidikan Terakhir
                            </TableCell>
                            <TableCell align="center" sx={{ borderBottom: '2px solid black', fontWeight: 'bold' }}>
                              No. HP
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {result.map((row, index) => (
                            <TableRow hover key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                              <TableCell component="th" scope="row">
                                {index + 1}
                              </TableCell>
                              <TableCell align="center">{row.user_full_name || '-'}</TableCell>
                              <TableCell align="center">
                                {convertDate(row.finish_time, 'dddd, DD MMMM YYYY HH:mm:ss') || '-'}
                              </TableCell>
                              <TableCell align="center">{row.grade.toFixed(2) || '-'}</TableCell>
                              <TableCell align="center">{row.latest_education || '-'}</TableCell>
                              <TableCell align="center">{row.phone_number || '-'}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                  <Grid item xs={12}>
                    {result.length === 0 && searchParams.get('uid') !== '' && (
                      <Typography variant="h4" fontWeight="bold" textAlign="center" color="error">
                        ANDA BELUM MENYELESAIKAN TEST INI
                      </Typography>
                    )}
                    {readLoginResponse().role_name !== 'admin' && result.length === 1 && (
                      <Typography variant="h4" fontWeight="bold" textAlign="center">
                        {`Nilai akhir Anda untuk test ini adalah ${result[0].grade.toFixed(2)}/100.00`}
                      </Typography>
                    )}
                  </Grid>
                  <Grid item xs="auto">
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<ArrowBackRounded />}
                      onClick={() => navigate('/lkpi/dashboard/hasil', { replace: true })}
                    >
                      Kembali ke Sesi Test
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </>
  );
};

export default ResultView;

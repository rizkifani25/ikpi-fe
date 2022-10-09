import { ArrowBackRounded } from '@mui/icons-material';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
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
import { useNavigate, useSearchParams } from 'react-router-dom';

const ResultView = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  console.log(searchParams.get('sid'));
  console.log(searchParams.get('uid'));

  const [result, setResult] = useState([
    {
      id: 1,
      user_full_name: 'Freyana',
      submit_time: 'Senin, 12 September 2022 09:25:25',
      grade: 85.0,
      latest_education: 'SMA',
      phone_number: '08123123123123',
    },
    {
      id: 2,
      user_full_name: 'Freyana',
      submit_time: 'Senin, 12 September 2022 09:25:25',
      grade: 85.0,
      latest_education: 'SMA',
      phone_number: '08123123123123',
    },
  ]);

  return (
    <>
      <Toolbar />
      <Grid container display="flex" direction="row" spacing={3} sx={{ p: 4 }}>
        <Grid item xs={12}>
          <Typography variant="h5">Hasil Sesi Test PT. IK Precision Indonesia</Typography>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <CardHeader title="TEST 1" subheader="12 September 2022 pukul 09:00"></CardHeader>
            <CardContent>
              <Grid display="flex" direction="row" container justifyContent="center" spacing={5}>
                <Grid item xs={12}>
                  <Typography variant="h5" textAlign="center">
                    Kuis ini ditutup pada hari Senin, 12 September 09:30:00
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h5" textAlign="center">
                    Durasi Test : 30.00 menit
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
                            <TableCell align="center">{row.submit_time || '-'}</TableCell>
                            <TableCell align="right">{row.grade || '-'}</TableCell>
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
                  {result.length === 1 && (
                    <Typography variant="h4" fontWeight="bold" textAlign="center">
                      Nilai akhir Anda untuk test ini adalah 85.00/100.00
                    </Typography>
                  )}
                </Grid>
                <Grid item xs="auto">
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<ArrowBackRounded />}
                    onClick={() => navigate('/lkpi/dashboard/session', { replace: true })}
                  >
                    Kembali ke Sesi Test
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default ResultView;

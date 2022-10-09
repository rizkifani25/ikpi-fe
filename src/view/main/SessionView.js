import React, { useEffect, useState } from 'react';
import { AddRounded, EditRounded, GradingRounded } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';
import { grey } from '@mui/material/colors';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Controller, useForm } from 'react-hook-form';
import { useSessions } from '../common/hooks/useSessions';
import { useMutation, useQuery } from 'react-query';
import { URL_API_SESSION_CREATE, URL_API_SESSION_GET_LIST, URL_API_SESSION_UPDATE } from '../common/constant';
import { useNavigate } from 'react-router';
import { readLoginResponse } from '../common/localstorage';
import SessionCard from './SessionCard';
import EditorField from './components/EditorField';
import useSnackbar from '../common/hooks/useSnackbar';

const { default: axios } = require('axios');

const createNewSessions = async (data) => await axios.post(URL_API_SESSION_CREATE, data);
const getSessions = async () => await axios.get(URL_API_SESSION_GET_LIST);
const handlePut = async (data) => await axios.put(data.url, data.data);

const SessionView = () => {
  const navigate = useNavigate();

  const { setAlert } = useSnackbar();

  const sessions = useSessions((state) => state.sessions);
  const setSessions = useSessions((state) => state.setSessions);

  const [mode, setMode] = useState('');

  const { isFetching, refetch } = useQuery('sessionList', getSessions, {
    onSuccess: (response) => {
      setSessions(response.data.data);
    },
    onError: () => {
      setAlert('Terjadi kesalahan tidak terduga. Coba lagi nanti.', 'error');
    },
  });

  const { isLoading, mutate } = useMutation(createNewSessions, {
    onSuccess: () => {
      refetch();
      handleCloseDialog();
      setAlert('Berhasil membuat sesi baru.', 'success');
    },
    onError: () => {
      setAlert('Terjadi kesalahan tidak terduga. Coba lagi nanti.', 'error');
    },
  });

  const { mutate: updateSession } = useMutation(handlePut, {
    onSuccess: () => {
      refetch();
      handleCloseDialog();
      setAlert('Berhasil update sesi.', 'success');
    },
    onError: () => {
      setAlert('Terjadi kesalahan tidak terduga. Coba lagi nanti.', 'error');
    },
  });

  const { handleSubmit, control, reset, watch, setValue } = useForm({
    mode: 'all',
    reValidateMode: 'onChange',
    defaultValues: { id: '', session_name: '', session_rules: '', start_time: '', end_time: '', status: '' },
  });

  const [dialog, setDialog] = useState({ isOpen: false });

  const handleOpenDialog = () => {
    reset();
    setMode('create');
    setDialog((prevValue) => ({ ...prevValue, isOpen: true }));
  };

  const handleCloseDialog = () => {
    setDialog((prevValue) => ({ ...prevValue, isOpen: false }));
  };

  const handleEditSession = (session) => {
    setMode('edit');
    setValue('id', session.id);
    setValue('session_name', session.session_name);
    setValue('session_rules', session.session_rules);
    setValue('start_time', session.start_time);
    setValue('end_time', session.end_time);
    setValue('status', session.status);
    setDialog((prevValue) => ({ ...prevValue, isOpen: true }));
  };

  const onSubmit = (data) => {
    if (mode === 'edit') {
      let updateReq = {
        url: URL_API_SESSION_UPDATE,
        data: {
          id: data.id,
          session_name: data.session_name,
          start_time: new Date(data.start_time).getTime(),
          end_time: new Date(data.end_time).getTime(),
          session_rules: data.session_rules,
          status: data.status,
        },
      };
      updateSession(updateReq);
    } else {
      mutate({
        session_name: data.session_name,
        start_time: new Date(data.start_time).getTime(),
        end_time: new Date(data.end_time).getTime(),
        session_rules: data.session_rules,
      });
    }
  };

  const editorValue = (field) => watch(field);

  const handleClickSessionCard = (sData) => {
    if (readLoginResponse().role_name !== 'admin') {
      if (sData.status === 'OPEN') {
        navigate(`/lkpi/dashboard/session/${sData.id}`, { replace: true });
      } else {
        setAlert('Sesi test belum dibuka. Kontak admin untuk membuka sesi test', 'warning');
      }
    } else {
      navigate(`/lkpi/dashboard/session/${sData.id}`, { replace: true });
    }
  };

  const handleClickResult = (sData) => {
    if (readLoginResponse().role_name !== 'admin') {
      navigate(`/lkpi/dashboard/session/result?sid=${sData.id}&uid=${readLoginResponse().id}`, { replace: true });
    } else {
      navigate(`/lkpi/dashboard/session/result?sid=${sData.id}&uid=`, { replace: true });
    }
  };

  useEffect(() => {
    return () => {
      const loginRes = readLoginResponse();
      if (loginRes === null) navigate('/lkpi/login');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          {readLoginResponse().role_name !== 'user' && (
            <Box display="flex" flexDirection="row">
              <Button variant="contained" startIcon={<AddRounded />} onClick={handleOpenDialog}>
                Tambah Sesi Baru
              </Button>
            </Box>
          )}
          <Grid container sx={{ mt: 3, width: '100%' }} spacing={1}>
            {sessions.map((session, index) => (
              <Grid key={index} item xs={12} md={12} lg={4}>
                <Card sx={{ width: '100%' }}>
                  <CardActionArea onClick={() => handleClickSessionCard(session)}>
                    <SessionCard sessionData={session} />
                  </CardActionArea>
                  <CardActions>
                    {readLoginResponse().role_name !== 'user' && (
                      <IconButton aria-label="edit" onClick={() => handleEditSession(session)}>
                        <EditRounded />
                      </IconButton>
                    )}
                    <IconButton aria-label="result" onClick={() => handleClickResult(session)}>
                      <GradingRounded />
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
      )}
      <Dialog open={dialog.isOpen} onClose={handleCloseDialog}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle>Tambahkan Sesi Baru</DialogTitle>
          <DialogContent sx={{ width: 500 }}>
            <Grid container sx={{ mt: 2 }} columnSpacing={3} rowSpacing={3}>
              <Grid item xs={12}>
                <Controller
                  render={({ field }) => <TextField label="Nama Sesi" variant="outlined" fullWidth {...field} />}
                  name="session_name"
                  control={control}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="select-status">Status</InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select labelId="select-status" label="Status" {...field}>
                        <MenuItem value="OPEN">Open</MenuItem>
                        <MenuItem value="CLOSED">Closed</MenuItem>
                      </Select>
                    )}
                    name="status"
                    control={control}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  Peraturan :
                </Typography>
                <EditorField
                  fieldId={'session_rules'}
                  value={editorValue('session_rules')}
                  onChange={(value) => setValue('session_rules', value)}
                />
              </Grid>
              <Grid item xs={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <Controller
                    render={({ field: { onChange, value } }) => (
                      <DateTimePicker
                        label="Waktu Mulai"
                        onChange={(openTime) => onChange(openTime)}
                        ampm={false}
                        value={value}
                        renderInput={(params) => <TextField fullWidth {...params} />}
                      />
                    )}
                    name="start_time"
                    control={control}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <Controller
                    render={({ field: { onChange, value } }) => (
                      <DateTimePicker
                        label="Waktu Selesai"
                        onChange={(closeTime) => onChange(closeTime)}
                        ampm={false}
                        value={value}
                        renderInput={(params) => <TextField fullWidth {...params} />}
                      />
                    )}
                    name="end_time"
                    control={control}
                  />
                </LocalizationProvider>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="primary" variant="outlined" size="large">
              Tutup
            </Button>
            <Button type="submit" color="primary" variant="contained" disabled={isLoading} size="large">
              {isLoading && (
                <CircularProgress
                  size="small"
                  sx={{
                    width: 20,
                    height: 20,
                    marginRight: 1,
                    color: grey[600],
                  }}
                />
              )}
              {mode === 'edit' ? 'Simpan' : 'Tambah'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

export default SessionView;

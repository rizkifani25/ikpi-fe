import React, { useEffect, useState } from 'react';
import { AddRounded } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';
import { grey } from '@mui/material/colors';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Controller, useForm } from 'react-hook-form';
import { useSessions } from '../common/hooks/useSessions';
import { useMutation } from 'react-query';
import SessionCard from './SessionCard';
import useSessionsList from '../common/hooks/useSessionsList';
import { URL_API_SESSION_CREATE } from '../common/constant';
import ReactQuill from 'react-quill';
import EditorToolbar, { modules, formats } from './components/EditorToolbar';
import { useNavigate } from 'react-router';
import { readLoginResponse } from '../common/localstorage';
import EditorField from './components/EditorField';

const { default: axios } = require('axios');

const createNewSessions = async (data) => await axios.post(URL_API_SESSION_CREATE, data);

const SessionView = () => {
  const { isFetching } = useSessionsList();

  const { isLoading, mutate } = useMutation(createNewSessions);

  const sessions = useSessions((state) => state.sessions);

  const [dialog, setDialog] = useState({ isOpen: false });

  const [tmpQuestion, setTmpQuestion] = useState('');
  const { handleSubmit, control, reset, watch, setValue } = useForm({
    mode: 'all',
    reValidateMode: 'onChange',
    defaultValues: { session_name: '', session_rules: '', start_time: '', end_time: '' },
  });

  const navigate = useNavigate();

  const handleOpenDialog = () => {
    reset();
    setDialog((prevValue) => ({ ...prevValue, isOpen: true }));
  };

  const handleCloseDialog = () => {
    setDialog((prevValue) => ({ ...prevValue, isOpen: false }));
  };

  const onSubmit = (data) => {
    mutate({
      session_name: data.session_name,
      start_time: new Date(data.start_time).getTime(),
      end_time: new Date(data.end_time).getTime(),
      session_rules: tmpQuestion,
    });
    handleCloseDialog();
  };

  const editorValue = (field) => watch(field);

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
          <Grid container sx={{ mt: 3, width: '100%' }} gap={2}>
            {sessions.map((session, index) => (
              <Grid key={index} item xs={12} md={12} lg={3} sx={{ width: '100%' }}>
                <Card sx={{ maxWidth: 345 }}>
                  <CardActionArea onClick={() => navigate(`/lkpi/dashboard/session/${session.id}`, { replace: true })}>
                    <SessionCard sessionData={session} />
                  </CardActionArea>
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
              Cancel
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
              Tambah
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

export default SessionView;

import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Grid from '@mui/material/Grid';
import SessionCard from './SessionCard';
import {
  Button,
  Card,
  CardActionArea,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import { AddRounded } from '@mui/icons-material';
import { Controller, useForm } from 'react-hook-form';
import { useState } from 'react';
import { grey } from '@mui/material/colors';
import { LocalizationProvider, DesktopTimePicker, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useSessions } from '../common/hooks/useSessions';

function DashboardContent() {
  const sessions = useSessions((state) => state.sessions);
  const addSession = useSessions((state) => state.addSession);

  const [isLoading, setIsLoading] = useState();
  const [dialog, setDialog] = useState({ isOpen: false });

  const { handleSubmit, control, reset } = useForm({
    mode: 'all',
    reValidateMode: 'onChange',
    defaultValues: { session_name: '', date: '', start_time: '', end_time: '' },
  });

  const handleOpenDialog = () => {
    reset();
    setDialog((prevValue) => ({ ...prevValue, isOpen: true }));
  };

  const handleCloseDialog = () => {
    setDialog((prevValue) => ({ ...prevValue, isOpen: false }));
  };

  const onSubmit = (data) => {
    addSession(data);
    handleCloseDialog();
  };

  return (
    <>
      <Toolbar />
      <Grid container sx={{ mt: 2, mb: 4, p: 4 }}>
        <Box display="flex" flexDirection="row">
          <Button variant="contained" startIcon={<AddRounded />} onClick={handleOpenDialog}>
            Tambah Sesi Baru
          </Button>
        </Box>
        <Grid container sx={{ mt: 3, width: '100%' }} gap={2}>
          {sessions.map((session, index) => (
            <Grid key={index} item xs={12} md={12} lg={2} sx={{ width: '100%' }}>
              <Card elevation={0} sx={{ maxWidth: 345, borderRadius: 3, border: 'dashed 1px #263238' }}>
                <CardActionArea>
                  <SessionCard sessionData={session} />
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Grid>
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
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <Controller
                    render={({ field: { onChange, value } }) => (
                      <DatePicker
                        label="Tanggal "
                        onChange={(openTime) => onChange(openTime)}
                        value={value}
                        renderInput={(params) => <TextField fullWidth {...params} />}
                      />
                    )}
                    name="date"
                    control={control}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <Controller
                    render={({ field: { onChange, value } }) => (
                      <DesktopTimePicker
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
                      <DesktopTimePicker
                        label="Waktu Selesai"
                        onChange={(openTime) => onChange(openTime)}
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
}

export default function Dashboard() {
  return <DashboardContent />;
}

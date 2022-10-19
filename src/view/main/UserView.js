import { AddRounded, EditRounded } from '@mui/icons-material';
import {
  Box,
  Button,
  Chip,
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
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Toolbar,
} from '@mui/material';
import { grey } from '@mui/material/colors';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useMutation, useQuery } from 'react-query';
import { URL_API_CREATE_USERS, URL_API_GET_USERS, URL_API_UPDATE_USER } from '../common/constant';
import useSnackbar from '../common/hooks/useSnackbar';
import { readLoginResponse } from '../common/localstorage';
import { generateRandomString } from '../common/utils';

const { default: axios } = require('axios');

const handlePost = async (data) => await axios.post(data.url, data.data);
const handleGet = async (data) => await axios.get(data.url);

const UserView = () => {
  const { setAlert } = useSnackbar();
  const [mode, setMode] = useState('');
  const [open, setOpen] = useState(false);
  const [users, setUsers] = useState([]);

  const { setValue, handleSubmit, control } = useForm({
    mode: 'all',
    reValidateMode: 'onChange',
    defaultValues: {
      id: '',
      user_full_name: '',
      email: '',
      password: '',
      phone_number: '',
      role_name: '',
      latest_education: '',
      status: 'ACTIVE',
    },
  });

  const { isFetching: loadingInit, refetch } = useQuery('listUser', () => handleGet({ url: URL_API_GET_USERS }), {
    onSuccess: (response) => {
      setUsers(response.data.data);
    },
    onError: () => {
      setAlert('Terjadi kesalahan tidak terduga. Coba lagi nanti.', 'error');
    },
  });

  const { isFetching: loadingCreate, mutate: createNewUser } = useMutation(handlePost, {
    onSuccess: () => {
      refetch();
      handleCloseDialog();
      setAlert('Sukses membuat user baru', 'success');
    },
    onError: () => {
      handleCloseDialog();
      setAlert('Terjadi kesalahan tidak terduga. Coba lagi nanti.', 'error');
    },
  });

  const { isFetching: loadingUpdate, mutate: updateUser } = useMutation(handlePost, {
    onSuccess: () => {
      refetch();
      handleCloseDialog();
      setAlert('Sukses update user', 'success');
    },
    onError: () => {
      handleCloseDialog();
      setAlert('Terjadi kesalahan tidak terduga. Coba lagi nanti.', 'error');
    },
  });

  const handleOpenDialog = () => {
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setMode('');
  };

  const generatePassword = () => {
    setValue('password', generateRandomString(8));
  };

  const handleEdit = (data) => {
    setMode('edit');
    setValue('id', data.id);
    setValue('user_full_name', data.user_full_name);
    setValue('email', data.email);
    setValue('password', data.password);
    setValue('phone_number', data.phone_number);
    setValue('role_name', data.role_name);
    setValue('latest_education', data.latest_education);
    setValue('status', data.status);
    handleOpenDialog();
  };

  const onSubmit = handleSubmit((data) => {
    if (mode === 'edit') {
      let updateReq = {
        url: URL_API_UPDATE_USER,
        data: {
          id_user: data.id,
          user_full_name: data.user_full_name,
          email: data.email,
          phone_number: data.phone_number,
          latest_education: data.latest_education,
          status: data.status,
        },
      };
      updateUser(updateReq);
    } else {
      let createUpdate = {
        url: URL_API_CREATE_USERS,
        data: {
          user_full_name: data.user_full_name,
          email: data.email,
          password: data.password,
          phone_number: data.phone_number,
          role: data.role_name,
          latest_education: data.latest_education,
        },
      };
      createNewUser(createUpdate);
    }
  });

  return (
    <>
      <Toolbar />
      {loadingInit && (
        <Box sx={{ maxWidth: 500, margin: '0 auto' }}>
          <Grid container direction="column" alignItems="center" justifyContent="center" sx={{ minHeight: '100vh' }}>
            <CircularProgress color="primary" />
          </Grid>
        </Box>
      )}

      <Grid container sx={{ mt: 2, mb: 4, p: 4 }}>
        {readLoginResponse().role_name === 'admin' && (
          <Box display="flex" flexDirection="row">
            <Button variant="contained" startIcon={<AddRounded />} onClick={() => handleOpenDialog()}>
              Tambah User Baru
            </Button>
          </Box>
        )}
        <Grid item xs={12} sx={{ mt: 2 }}>
          {!loadingInit && (
            <TableContainer component={Paper}>
              <Table stickyHeader sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ borderBottom: '2px solid black', fontWeight: 'bold' }}>No.</TableCell>
                    <TableCell align="center" sx={{ borderBottom: '2px solid black', fontWeight: 'bold' }}>
                      Nama Lengkap
                    </TableCell>
                    <TableCell align="center" sx={{ borderBottom: '2px solid black', fontWeight: 'bold' }}>
                      Email
                    </TableCell>
                    <TableCell align="center" sx={{ borderBottom: '2px solid black', fontWeight: 'bold' }}>
                      No. HP
                    </TableCell>
                    <TableCell align="center" sx={{ borderBottom: '2px solid black', fontWeight: 'bold' }}>
                      Pendidikan Terakhir
                    </TableCell>
                    <TableCell align="center" sx={{ borderBottom: '2px solid black', fontWeight: 'bold' }}>
                      Role
                    </TableCell>
                    <TableCell align="center" sx={{ borderBottom: '2px solid black', fontWeight: 'bold' }}>
                      Status
                    </TableCell>
                    <TableCell align="center" sx={{ borderBottom: '2px solid black', fontWeight: 'bold' }}>
                      Action
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((row, index) => (
                    <TableRow hover key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell component="th" scope="row">
                        {index + 1}
                      </TableCell>
                      <TableCell align="center">{row.user_full_name || '-'}</TableCell>
                      <TableCell align="center">{row.email || '-'}</TableCell>
                      <TableCell align="right">{row.phone_number || '-'}</TableCell>
                      <TableCell align="center">{row.latest_education || '-'}</TableCell>
                      <TableCell align="center">{row.role_name || '-'}</TableCell>
                      <TableCell align="center">
                        {row.status === 'ACTIVE' && <Chip label={row.status} color="success" />}
                        {row.status !== 'ACTIVE' && <Chip label={row.status} color="error" />}
                      </TableCell>
                      <TableCell align="center">
                        <IconButton aria-label="edit" onClick={() => handleEdit(row)}>
                          <EditRounded />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Grid>
      </Grid>
      <Dialog open={open} onClose={handleCloseDialog} maxWidth="sm" scroll="paper">
        <DialogTitle>Tambah User</DialogTitle>
        <DialogContent dividers>
          <form>
            <Grid container direction="row" spacing={3}>
              <Grid item xs={12}>
                <Controller
                  render={({ field }) => (
                    <TextField type="text" fullWidth label="Nama Lengkap" variant="outlined" {...field} />
                  )}
                  name="user_full_name"
                  control={control}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  render={({ field }) => (
                    <TextField type="email" fullWidth label="Email" variant="outlined" {...field} />
                  )}
                  name="email"
                  control={control}
                />
              </Grid>
              <Grid item xs={8}>
                <Controller
                  render={({ field }) => (
                    <TextField type="text" fullWidth label="Password" variant="outlined" {...field} />
                  )}
                  name="password"
                  control={control}
                />
              </Grid>
              <Grid item xs={4} alignItems="center">
                <Button variant="contained" fullWidth onClick={() => generatePassword()}>
                  Generate
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Controller
                  render={({ field }) => (
                    <TextField type="text" fullWidth label="No. HP" variant="outlined" {...field} />
                  )}
                  name="phone_number"
                  control={control}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  render={({ field }) => (
                    <TextField type="text" fullWidth label="Pendidikan Terakhir" variant="outlined" {...field} />
                  )}
                  name="latest_education"
                  control={control}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="select-role">Role User</InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select labelId="select-role" label="Role User" {...field}>
                        <MenuItem value="user">User</MenuItem>
                        <MenuItem value="admin">Admin</MenuItem>
                      </Select>
                    )}
                    name="role_name"
                    control={control}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="select-status">Status</InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select labelId="select-status" label="Status" {...field}>
                        <MenuItem value="ACTIVE">ACTIVE</MenuItem>
                        <MenuItem value="INACTIVE">INACTIVE</MenuItem>
                      </Select>
                    )}
                    name="status"
                    control={control}
                  />
                </FormControl>
              </Grid>
            </Grid>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary" variant="outlined" size="large">
            Tutup
          </Button>
          <Button
            onClick={onSubmit}
            color="primary"
            variant="contained"
            disabled={loadingCreate && loadingUpdate}
            size="large"
          >
            {loadingCreate && loadingUpdate && (
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
      </Dialog>
    </>
  );
};

export default UserView;

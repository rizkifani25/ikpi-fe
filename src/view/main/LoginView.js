import { LoginRounded, Visibility, VisibilityOff } from '@mui/icons-material';
import {
  AppBar,
  Box,
  Button,
  CircularProgress,
  CssBaseline,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';
import { grey } from '@mui/material/colors';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { saveLoginResponse } from '../common/localstorage';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel } from 'react-responsive-carousel';
import { URL_API_USER_LOGIN } from '../common/constant';
import { handlePostRequest } from '../common/api';
import useSnackbar from '../common/hooks/useSnackbar';

const LoginView = () => {
  const navigate = useNavigate();
  const { setAlert } = useSnackbar();

  const [isLoading, setIsLoading] = useState(false);
  const [dialogLogin, setDialogLogin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = useForm({
    mode: 'all',
    reValidateMode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const toggleDialogLogin = () => {
    setDialogLogin(!dialogLogin);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const onSubmit = (data) => {
    setIsLoading(true);
    let fetchData = {
      url: URL_API_USER_LOGIN,
      data: data,
    };
    handlePostRequest(fetchData)
      .then((response) => {
        if (response.data.response_code === 200) {
          saveLoginResponse(response.data.data);
          navigate('/lkpi/dashboard', { replace: true });
        } else {
          setAlert(response.data.response_message || 'Terjadi kesalahan tidak terduga. Gagal login.', 'error');
        }
      })
      .catch((err) => {
        setIsLoading(false);
        setAlert('Terjadi kesalahan tidak terduga. Gagal login.', 'error');
      });
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="absolute" open={false}>
        <Toolbar
          sx={{
            pr: '24px',
          }}
        >
          <img style={{ height: '50px' }} alt="Logo IKPI" src={`${process.env.PUBLIC_URL}/assets/logo.png`} />
          <Typography component="h1" variant="h6" color="inherit" noWrap sx={{ flexGrow: 1, ml: 2 }}>
            PT. IK Precision Indonesia
          </Typography>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            color="inherit"
            onClick={toggleDialogLogin}
          >
            <LoginRounded />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Carousel width={'100%'} showArrows={true} showThumbs={false} autoPlay={true} infiniteLoop={true}>
        <div>
          <img
            style={{ height: '100vh', objectFit: 'cover' }}
            alt="gambar 1"
            src={`${process.env.PUBLIC_URL}/assets/bg1.jpeg`}
          />
        </div>
        <div>
          <img
            style={{ height: '100vh', objectFit: 'cover' }}
            alt="gambar 2"
            src={`${process.env.PUBLIC_URL}/assets/bg2.jpg`}
          />
        </div>
        <div>
          <img
            style={{ height: '100vh', objectFit: 'cover' }}
            alt="gambar 3"
            src={`${process.env.PUBLIC_URL}/assets/bg3.jpg`}
          />
        </div>
      </Carousel>
      <Dialog
        open={dialogLogin}
        onClose={toggleDialogLogin}
        sx={{
          '& .MuiDialog-paper': {
            position: 'absolute',
            right: 10,
            top: 50,
          },
        }}
      >
        <DialogTitle>Login</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box height={20}></Box>
            <Controller
              render={({ field }) => (
                <TextField
                  fullWidth
                  id="email"
                  name="email"
                  label="Email"
                  variant="outlined"
                  disabled={isSubmitting}
                  {...field}
                />
              )}
              name="email"
              control={control}
            />
            <Box height={20}></Box>
            <Controller
              render={({ field }) => (
                <TextField
                  fullWidth
                  id="password"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  variant="outlined"
                  disabled={isSubmitting}
                  {...field}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShowPassword(!showPassword)}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {showPassword ? (
                            <VisibilityOff sx={{ color: grey[400] }} />
                          ) : (
                            <Visibility sx={{ color: grey[400] }} />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              )}
              name="password"
              control={control}
            />
            <Box height={20}></Box>
            <Button fullWidth type="submit" variant="contained" color="primary" size="large" disabled={isLoading}>
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
              {isLoading ? 'Loading' : 'LOGIN'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default LoginView;

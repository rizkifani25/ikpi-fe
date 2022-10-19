import * as React from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { Outlet, useNavigate } from 'react-router';
import { ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import {
  AccountCircle,
  DashboardRounded,
  GradingRounded,
  PowerSettingsNewRounded,
  ViewListRounded,
} from '@mui/icons-material';
import { readLoginResponse, removeLoginResponse } from '../common/localstorage';

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }) => ({
  '& .MuiDrawer-paper': {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: 'border-box',
    ...(!open && {
      overflowX: 'hidden',
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up('sm')]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

const mdTheme = createTheme();

const MainLayout = () => {
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(true);
  const [activeMenu, setActiveMenu] = React.useState(1);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleNavClick = (href, menu) => {
    if (menu !== 5) setActiveMenu(menu);
    navigate(href, { replace: true });
  };

  const handleLogout = () => {
    removeLoginResponse();
    handleNavClick('/lkpi/login', 4);
  };

  return (
    <ThemeProvider theme={mdTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="absolute" open={open}>
          <Toolbar
            sx={{
              pr: '24px',
            }}
          >
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: '36px',
                ...(open && { display: 'none' }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography component="h1" variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
              PT. IK Precision Indonesia
            </Typography>
            <Typography component="h1" variant="h6" color="inherit" noWrap>
              {readLoginResponse().user_full_name}
            </Typography>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <Toolbar
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              px: [1],
            }}
          >
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          <List component="nav">
            <React.Fragment>
              {readLoginResponse().role_name === 'user' && (
                <ListItemButton
                  onClick={() => handleNavClick('/lkpi/dashboard/main', 1)}
                  sx={{ borderRight: activeMenu === 1 ? 'solid 3px blue !important' : '' }}
                >
                  <ListItemIcon>
                    <DashboardRounded color={activeMenu === 1 ? 'primary' : ''} />
                  </ListItemIcon>
                  <ListItemText primary="Dashboard" />
                </ListItemButton>
              )}
              <ListItemButton
                onClick={() => handleNavClick('/lkpi/dashboard/session/', 2)}
                sx={{ borderRight: activeMenu === 2 ? 'solid 3px blue !important' : '' }}
              >
                <ListItemIcon>
                  <ViewListRounded color={activeMenu === 2 ? 'primary' : ''} />
                </ListItemIcon>
                <ListItemText primary="Sesi Test" />
              </ListItemButton>
              {readLoginResponse().role_name === 'admin' && (
                <ListItemButton
                  onClick={() => handleNavClick('/lkpi/dashboard/hasil', 3)}
                  sx={{ borderRight: activeMenu === 3 ? 'solid 3px blue !important' : '' }}
                >
                  <ListItemIcon>
                    <GradingRounded color={activeMenu === 3 ? 'primary' : ''} />
                  </ListItemIcon>
                  <ListItemText primary="Hasil Sesi Test" />
                </ListItemButton>
              )}
              {readLoginResponse().role_name === 'admin' && (
                <ListItemButton
                  onClick={() => handleNavClick('/lkpi/dashboard/user', 4)}
                  sx={{ borderRight: activeMenu === 4 ? 'solid 3px blue !important' : '' }}
                >
                  <ListItemIcon>
                    <AccountCircle color={activeMenu === 4 ? 'primary' : ''} />
                  </ListItemIcon>
                  <ListItemText primary="User" />
                </ListItemButton>
              )}
              <ListItemButton onClick={() => handleLogout()}>
                <ListItemIcon>
                  <PowerSettingsNewRounded />
                </ListItemIcon>
                <ListItemText primary="Log Out" />
              </ListItemButton>
            </React.Fragment>
          </List>
        </Drawer>
        <Box
          display="flex"
          flexDirection="column"
          sx={{
            backgroundColor: (theme) => theme.palette.grey[100],
            height: '100vh',
            width: '100%',
            overflowY: 'scroll',
          }}
        >
          {<Outlet />}
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default MainLayout;

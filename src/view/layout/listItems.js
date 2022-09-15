import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { DashboardRounded, PowerSettingsNewRounded, ViewListRounded } from '@mui/icons-material';

export const mainListItems = (
  <React.Fragment>
    <ListItemButton>
      <ListItemIcon>
        <DashboardRounded />
      </ListItemIcon>
      <ListItemText primary="Dashboard" />
    </ListItemButton>
    <ListItemButton>
      <ListItemIcon>
        <ViewListRounded />
      </ListItemIcon>
      <ListItemText primary="Sesi Test" />
    </ListItemButton>
    <ListItemButton>
      <ListItemIcon>
        <PowerSettingsNewRounded />
      </ListItemIcon>
      <ListItemText primary="Log Out" />
    </ListItemButton>
  </React.Fragment>
);

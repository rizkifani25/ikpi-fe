import { createTheme } from '@mui/material';

const theme = createTheme({
  components: {
    MuiCardContent: {
      styleOverrides: {
        root: {
          backgroundColor: '#47A4DB',
        },
      },
    },
  },
});

export default theme;

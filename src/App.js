import { Box, CircularProgress, Grid } from '@mui/material';
import { Suspense } from 'react';
import { useRoutes } from 'react-router';
import routes from './routes';

const App = () => {
  const routing = useRoutes(routes);
  return (
    <Suspense
      fallback={
        <Box sx={{ maxWidth: 500, margin: '0 auto' }}>
          <Grid container direction="column" alignItems="center" justifyContent="center" sx={{ minHeight: '100vh' }}>
            <CircularProgress color="primary" />
          </Grid>
        </Box>
      }
    >
      {routing}
    </Suspense>
  );
};

export default App;

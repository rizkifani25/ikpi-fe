import * as React from 'react';
import Typography from '@mui/material/Typography';
import { convertDate } from '../common/utils';
import { Box, CardContent, CardHeader, Chip } from '@mui/material';

const SessionCard = ({ sessionData }) => {
  return (
    <React.Fragment>
      <CardHeader
        component="div"
        title={
          <Box direction="row" display="flex" justifyContent="space-between" alignItems="center">
            {sessionData.session_name}
            <>
              {sessionData.status === 'OPEN' && (
                <Chip size="small" label={sessionData.status || 'OPEN'} color="success" />
              )}
              {sessionData.status === 'CLOSED' && (
                <Chip size="small" label={sessionData.status || 'CLOSED'} color="error" />
              )}
            </>
          </Box>
        }
        subheader={`${convertDate(sessionData.start_time, 'dddd, DD MMMM YYYY')}`}
      />
      <CardContent>
        <Typography variant="body1" sx={{ flex: 1 }}>
          {`Mulai: ${convertDate(sessionData.start_time, 'dddd, DD MMMM YYYY HH:mm')}`}
        </Typography>
        <Typography variant="body1" sx={{ flex: 1 }}>
          {`Selesai: ${convertDate(sessionData.end_time, 'dddd, DD MMMM YYYY HH:mm')}`}
        </Typography>
      </CardContent>
    </React.Fragment>
  );
};

export default SessionCard;

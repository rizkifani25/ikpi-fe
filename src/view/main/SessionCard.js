import * as React from 'react';
import Typography from '@mui/material/Typography';
import { convertDate } from '../common/utils';
import { CardContent, CardHeader } from '@mui/material';

const SessionCard = ({ sessionData }) => {
  return (
    <React.Fragment>
      <CardHeader
        title={sessionData.session_name}
        subheader={`${convertDate(sessionData.date, 'dddd, DD MMMM YYYY')}`}
      />
      <CardContent>
        <Typography variant="body1" sx={{ flex: 1 }}>
          {`Sesi Durasi : ${convertDate(sessionData.start_time, 'HH:mm')} - ${convertDate(
            sessionData.end_time,
            'HH:mm'
          )}`}
        </Typography>
      </CardContent>
    </React.Fragment>
  );
};

export default SessionCard;

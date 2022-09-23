import { Button, Card, CardActions, CardContent, CardHeader, Typography } from '@mui/material';
import React from 'react';

const QuestionCard = ({ number, question }) => {
  return (
    <Card variant="outlined">
      <CardHeader title={`No ${number}`} />
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          Word of the Day
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          adjective
        </Typography>
        <Typography variant="body2">
          well meaning and kindly.
          <br />
          {'"a benevolent smile"'}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Learn More</Button>
      </CardActions>
    </Card>
  );
};

export default QuestionCard;

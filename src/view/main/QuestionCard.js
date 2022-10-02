import { DeleteRounded, EditRounded, TimerRounded } from '@mui/icons-material';
import { Card, CardActions, CardContent, CardHeader, Grid, IconButton, Typography } from '@mui/material';
import React from 'react';

const QuestionCard = ({ number, question, openDetail }) => {
  return (
    <Card variant="outlined">
      <CardHeader title={`Pertanyaan ${number}`} />
      <CardContent>
        <Grid container alignItems="center">
          <Grid item>
            <TimerRounded />
          </Grid>
          <Grid item>
            <Typography variant="body1">{`${question.question_duration} detik`}</Typography>
          </Grid>
        </Grid>
      </CardContent>
      <CardActions>
        <IconButton aria-label="delete" onClick={() => openDetail(question)}>
          <EditRounded />
        </IconButton>
        <IconButton aria-label="delete">
          <DeleteRounded color="error" />
        </IconButton>
      </CardActions>
    </Card>
  );
};

export default QuestionCard;

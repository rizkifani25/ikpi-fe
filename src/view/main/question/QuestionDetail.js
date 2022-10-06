import { Box, Card, CardContent, CircularProgress, FormControlLabel, Grid, Radio, RadioGroup } from '@mui/material';
import React from 'react';
import ReactQuill from 'react-quill';

const QuestionDetail = ({ isLoading, data, userAnswer, handleChange }) => {
  return (
    <>
      {isLoading && (
        <Box sx={{ maxWidth: 500, margin: '0 auto' }}>
          <Grid container direction="column" alignItems="center" justifyContent="center" sx={{ minHeight: '100vh' }}>
            <CircularProgress color="primary" />
          </Grid>
        </Box>
      )}
      {!isLoading && data && (
        <>
          <ReactQuill theme="bubble" value={data.question} readOnly={true} />
          <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            name="radio-buttons-group"
            value={userAnswer}
            onChange={handleChange}
          >
            <Grid container sx={{ width: '100%' }} spacing={1}>
              {data.answers.map((answer, index) => (
                <Grid key={index} item xs={12} md={12} lg={3}>
                  <FormControlLabel
                    value={answer.id}
                    control={<Radio />}
                    label={
                      <Card sx={{ width: '100%' }}>
                        <CardContent>
                          <ReactQuill theme="bubble" value={answer.answer} readOnly={true} />
                        </CardContent>
                      </Card>
                    }
                  />
                </Grid>
              ))}
            </Grid>
          </RadioGroup>
        </>
      )}
    </>
  );
};

export default QuestionDetail;

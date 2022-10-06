import { Box, Button, Card, CardContent, CardHeader, Chip, Grid, Toolbar, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { handlePostRequest } from '../../common/api';
import { URL_API_QUESTION_GET_USER } from '../../common/constant';
import useSnackbar from '../../common/hooks/useSnackbar';
import { readDetailSession, readLoginResponse } from '../../common/localstorage';
import QuestionDetail from './QuestionDetail';

const QuestionWrapper = () => {
  const listQuestion = readDetailSession().questions_id;
  const { setAlert } = useSnackbar();
  const [isLoading, setIsLoading] = useState();
  const [qIdx, setQIdx] = useState(0);
  const [data, setData] = useState(null);
  const [answer, setAnswer] = useState('');

  const getDetailQuestionUser = (questionId) => {
    setIsLoading(true);
    handlePostRequest({
      url: URL_API_QUESTION_GET_USER,
      data: {
        id_question: questionId,
      },
    })
      .then((response) => {
        setIsLoading(false);
        if (response.status === 200) {
          setData(response.data.data);
        } else {
          setAlert('Gagal mendapatkan data. Tolong, coba lagi.', 'error');
        }
      })
      .catch(() => {
        setIsLoading(false);
        setAlert('Gagal mendapatkan data. Tolong, coba lagi.', 'error');
      });
  };

  const storeAnswer = (questionId) => {
    console.log(questionId, readLoginResponse().id, answer);
  };

  const handleClickNext = () => {
    setQIdx((prev) => {
      const result = prev + 1;
      storeAnswer(listQuestion[result]);
      getDetailQuestionUser(listQuestion[result]);
      return result;
    });
  };

  const handleChange = (event) => {
    setAnswer(event.target.value);
  };

  useEffect(() => {
    let subscribed = true;

    return () => {
      if (subscribed) {
        getDetailQuestionUser(listQuestion[qIdx]);
        subscribed = false;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box sx={{ maxWidth: '100%', flexGrow: 1, p: 4 }}>
      <Toolbar />
      <Card>
        <CardHeader
          title={
            <Chip
              label={<Typography variant="h6">{`SOAL ${qIdx + 1}`}</Typography>}
              color="primary"
              sx={{
                '& .MuiChip-root': {
                  borderRadius: 0,
                },
              }}
            />
          }
        ></CardHeader>
        <CardContent>
          <Box sx={{ maxWidth: '100%', width: '100%', p: 4 }}>
            {<QuestionDetail isLoading={isLoading} data={data} userAnswer={answer} handleChange={handleChange} />}
          </Box>
        </CardContent>
      </Card>
      <Grid container direction="row" justifyContent="flex-end" alignItems="center" sx={{ mt: 2 }}>
        <Grid item>
          <Button variant="contained" size="large" onClick={() => handleClickNext()}>
            {listQuestion.length - 1 === qIdx ? 'Selesai' : 'Selanjutnya'}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default QuestionWrapper;

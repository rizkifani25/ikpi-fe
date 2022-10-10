import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  CircularProgress,
  Grid,
  Toolbar,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { URL_API_ANSWER_STORE, URL_API_QUESTION_GET_USER, URL_API_STORE_RESULT } from '../../common/constant';
import { readDetailSession, readLoginResponse } from '../../common/localstorage';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import { useNavigate } from 'react-router';
import {} from 'react-router-dom';
import QuestionDetail from './QuestionDetail';
import useSnackbar from '../../common/hooks/useSnackbar';

const { default: axios } = require('axios');

const handlePost = async (data) => await axios.post(data.url, data.data);

const QuestionWrapper = () => {
  const navigate = useNavigate();
  const { setAlert } = useSnackbar();

  const listQuestion = readDetailSession().questions_id;
  const [qIdx, setQIdx] = useState(0);
  const [qDetail, setQDetail] = useState({});
  const [answer, setAnswer] = useState('0');

  const fetchData = {
    url: URL_API_QUESTION_GET_USER,
    data: {
      id_question: listQuestion[qIdx],
    },
  };

  const { isFetching } = useQuery(['questionDetail', fetchData], () => handlePost(fetchData), {
    onSuccess: (response) => {
      setQDetail(response.data.data);
    },
    onError: (err) => {
      console.log(err);
      setQDetail({});
      setAlert('Gagal mendapatkan data. Tolong, coba lagi.', 'error');
      navigate(`/lkpi/dashboard/session/${readDetailSession().id}`, { replace: true });
    },
  });

  const { mutate: storeResult } = useMutation(handlePost, {
    onSuccess: () => {
      navigate(`/lkpi/dashboard/session/result?sid=${readDetailSession().id}&uid=${readLoginResponse().id}`, {
        replace: true,
      });
    },
    onError: () => {
      setAlert('Gagal menyimpan hasil.', 'error');
    },
  });

  const { mutate: storeAnswer } = useMutation(handlePost, {
    onSuccess: () => {
      setAlert('Sukses menyimpan jawaban.', 'success');
      if (listQuestion.length <= qIdx + 1) {
        let fetchData = {
          url: URL_API_STORE_RESULT,
          data: {
            id_session: readDetailSession().id,
            id_user: readLoginResponse().id,
            finish_time: new Date().getTime(),
          },
        };
        storeResult(fetchData);
      } else {
        setQIdx((prev) => {
          const result = prev + 1;
          return result;
        });
      }
    },
    onError: () => {
      setAlert('Gagal menyimpan jawaban.', 'error');
      setQIdx((prev) => {
        const result = prev + 1;
        return result;
      });
    },
  });

  const handleClickNext = () => {
    const fetchData = {
      url: URL_API_ANSWER_STORE,
      data: {
        id_question: listQuestion[qIdx],
        id_user: readLoginResponse().id,
        id_answer: answer,
      },
    };
    storeAnswer(fetchData);
  };

  const handleChangeAnswer = (event) => {
    setAnswer(event.target.value);
  };

  useEffect(() => {
    const unloadCallback = (event) => {
      localStorage.setItem('isRefresh', 'true');
      event.preventDefault();
      event.returnValue = 'Anda tidak bisa mengulang sesi ini lagi. Anda yakin?';
      return '';
    };

    window.addEventListener('beforeunload', unloadCallback);

    const checkIsRefresh = () => {
      if (localStorage.getItem('isRefresh') === 'true') {
        navigate(`/lkpi/dashboard/session/${readDetailSession().id}`, { replace: true });
      }
    };

    checkIsRefresh();

    return () => window.removeEventListener('beforeunload', unloadCallback);
  }, []);

  return (
    <>
      <Box sx={{ maxWidth: '100%', flexGrow: 1, p: 4 }}>
        <Toolbar />
        <Card>
          {isFetching && (
            <Box sx={{ maxWidth: 500, margin: '0 auto' }}>
              <Grid
                container
                direction="column"
                alignItems="center"
                justifyContent="center"
                sx={{ minHeight: '100vh' }}
              >
                <CircularProgress color="primary" />
              </Grid>
            </Box>
          )}
          {!isFetching && (
            <CardHeader
              component="div"
              title={
                <Box direction="row" display="flex" justifyContent="space-between">
                  <Chip
                    label={<Typography variant="h6">{`SOAL ${qIdx + 1}`}</Typography>}
                    color="primary"
                    sx={{
                      '& .MuiChip-root': {
                        borderRadius: 0,
                      },
                    }}
                  />
                  <CountdownCircleTimer
                    isPlaying
                    size={50}
                    strokeWidth={5}
                    duration={qDetail.question_duration}
                    colors={['#004777', '#F7B801', '#A30000', '#A30000']}
                    colorsTime={[qDetail.question_duration, qDetail.question_duration / 2, 5, 0]}
                    onComplete={() => handleClickNext()}
                  >
                    {({ remainingTime }) => remainingTime}
                  </CountdownCircleTimer>
                </Box>
              }
            />
          )}

          <CardContent>
            <Box sx={{ maxWidth: '100%', width: '100%', p: 4 }}>
              <QuestionDetail
                isFetching={isFetching}
                data={qDetail}
                answer={answer}
                handleChangeAnswer={handleChangeAnswer}
              />
            </Box>
          </CardContent>
        </Card>
        <Grid container direction="row" justifyContent="flex-end" alignItems="center" sx={{ mt: 2 }}>
          <Grid item>
            <Button variant="contained" size="large" onClick={() => handleClickNext()}>
              {listQuestion.length <= qIdx + 1 ? 'Selesai' : 'Selanjutnya'}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default QuestionWrapper;

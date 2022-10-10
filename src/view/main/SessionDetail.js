import { AccessTimeRounded, AddRounded, ArrowBackRounded, CheckBoxRounded, DeleteRounded } from '@mui/icons-material';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';
import { grey } from '@mui/material/colors';
import { Box } from '@mui/system';
import React, { useState } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { useMutation, useQuery } from 'react-query';
import ReactQuill from 'react-quill';
import { useNavigate, useParams } from 'react-router';
import {
  URL_API_QUESTION_CREATE,
  URL_API_QUESTION_UPDATE,
  URL_API_SESSION_DETAIL,
  URL_API_SESSION_DETAIL_USER,
} from '../common/constant';
import { useSessions } from '../common/hooks/useSessions';
import useSnackbar from '../common/hooks/useSnackbar';
import { readLoginResponse, saveDetailSession } from '../common/localstorage';
import { convertDate, getAlphabet } from '../common/utils';
import EditorField from './components/EditorField';
import QuestionCard from './QuestionCard';

const { default: axios } = require('axios');

const getDetailSession = async (data) => await axios.post(data.url, data.data);
const createQuestion = async (data) => await axios.post(data.url, data.data);
const updateQuestion = async (data) => await axios.put(data.url, data.data);

const SessionDetail = () => {
  const navigate = useNavigate();

  const { id } = useParams();
  const { setAlert } = useSnackbar();

  const detailSession = useSessions((state) => state.detailSession);
  const setDetailSession = useSessions((state) => state.setDetailSession);

  const loginRes = readLoginResponse();
  const fetchData = {
    url: loginRes.role_name === 'user' ? URL_API_SESSION_DETAIL_USER : URL_API_SESSION_DETAIL,
    data: {
      id_session: id,
      id_user: loginRes.id,
    },
  };

  const { isFetching, refetch } = useQuery('sessionDetail', () => getDetailSession(fetchData), {
    onSuccess: (response) => {
      setDetailSession(response.data.data);
      saveDetailSession(response.data.data);
    },
    onError: () => {
      setAlert('Terjadi kesalahan tidak terduga. Coba lagi nanti.', 'error');
    },
  });

  const actionQuestion = (request) => {
    if (request.mode === 'create') return createQuestion(request.data);
    if (request.mode === 'edit') return updateQuestion(request.data);
  };

  const { mutate } = useMutation(actionQuestion, {
    onSuccess: () => {
      handleCloseDialog();
      refetch();
    },
    onError: () => {
      handleCloseDialog();
      setAlert('Terjadi kesalahan tidak terduga. Coba lagi nanti.', 'error');
    },
  });

  const { setValue, watch, handleSubmit, control, getValues } = useForm({
    mode: 'all',
    reValidateMode: 'onChange',
    defaultValues: { id_session: id, id: '', question: '', question_type: '', question_duration: 0, answer_option: [] },
  });
  const { append, remove } = useFieldArray({ name: 'answer_option', control });

  const [mode, setMode] = useState('');
  const [dialog, setDialog] = useState({ isOpen: false });

  const handleOpenDialog = () => {
    setDialog((prevValue) => ({ ...prevValue, isOpen: true }));
  };

  const handleCloseDialog = () => {
    setDialog((prevValue) => ({ ...prevValue, isOpen: false }));
  };

  const onSubmit = handleSubmit((data) => {
    if (mode === 'edit') {
      let request = {
        url: URL_API_QUESTION_UPDATE,
        data: {
          id: data.id,
          question: data.question,
          question_type: data.question_type,
          question_duration: data.question_duration,
          answer: data.answer_option,
        },
      };
      mutate({ mode: 'edit', data: request });
    } else {
      let request = {
        url: URL_API_QUESTION_CREATE,
        data: data,
      };
      mutate({ mode: 'create', data: request });
    }
  });

  const handleButtonBack = () => {
    navigate('/lkpi/dashboard/session', { replace: true });
  };

  const handleOpenDetail = (data) => {
    setValue('id', data.id);
    setValue('id_session', data.id_session);
    setValue('question', data.question);
    setValue('question_type', data.question_type);
    setValue('question_duration', data.question_duration);
    setValue('answer_option', data.answer);
    setMode('edit');
    handleOpenDialog();
  };

  const editorValue = (field) => watch(field);

  const handleAddAnswer = () => append({ id: '', answer: '', is_correct: false });

  const handleDeleteAnswer = (index) => () => remove(index);

  const handleStartTest = () => {
    if (detailSession.questions_id.length === 0 || !detailSession.is_user_eligible) {
      setAlert('User tidak dapat memulai test. Kontak administrator untuk keterangan lebih lanjut.', 'warning');
    } else {
      localStorage.setItem('isRefresh', 'false');
      navigate(`/lkpi/dashboard/session/${id}/ontest`, { replace: true });
    }
  };

  return (
    <>
      <Toolbar />
      {isFetching && (
        <Box sx={{ maxWidth: 500, margin: '0 auto' }}>
          <Grid container direction="column" alignItems="center" justifyContent="center" sx={{ minHeight: '100vh' }}>
            <CircularProgress color="primary" />
          </Grid>
        </Box>
      )}
      {!isFetching && (
        <Grid container sx={{ mt: 2, mb: 4, p: 4 }} gap={4}>
          <Grid item xs={3}>
            <Button variant="contained" startIcon={<ArrowBackRounded />} onClick={() => handleButtonBack()}>
              Kembali
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Card>
              <CardHeader
                title={detailSession.session_name}
                subheader={`${convertDate(new Date(detailSession.start_time), 'dddd, DD MMMM YYYY')}`}
              />
              <CardContent>
                <Box display="flex" direction="row" alignContent="center" sx={{ mt: 1 }}>
                  <AccessTimeRounded color="primary" sx={{ mr: 1 }} />
                  <Typography variant="body1" alignItems="center">
                    {`Waktu Pengerjaan : ${detailSession.time_duration} detik`}
                  </Typography>
                </Box>
                <Box display="flex" direction="row" alignContent="center" sx={{ mt: 1 }}>
                  <CheckBoxRounded color="primary" sx={{ mr: 1 }} />
                  <Typography variant="body1" alignItems="center">
                    {`Jumlah Soal : ${detailSession.total_question} soal`}
                  </Typography>
                </Box>
                <Typography variant="h5" sx={{ mt: 2 }}>
                  Peraturan
                </Typography>
                <ReactQuill theme="bubble" value={detailSession.session_rules} readOnly={true} />
                {readLoginResponse().role_name !== 'user' && (
                  <>
                    <Grid container flexDirection="row" alignItems="center" justifyContent="space-between">
                      <Grid item>
                        <Typography variant="h5" sx={{ mt: 3 }}>
                          Daftar Pertanyaan
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Button variant="contained" startIcon={<AddRounded />} onClick={() => handleOpenDialog()}>
                          Tambah Pertanyaan
                        </Button>
                      </Grid>
                    </Grid>
                    <>
                      <Grid container sx={{ mt: 3, width: '100%' }} gap={2}>
                        {detailSession.question.length > 0 &&
                          detailSession.question.map((q, index) => (
                            <Grid key={q.id} item xs={12} md={12} lg={2} sx={{ width: '100%' }}>
                              <QuestionCard number={index + 1} question={q} openDetail={handleOpenDetail} />
                            </Grid>
                          ))}
                      </Grid>
                    </>
                  </>
                )}
                {readLoginResponse().role_name === 'user' && (
                  <Grid container flexDirection="row" alignItems="center" justifyContent="center">
                    <Button variant="contained" color="primary" size="large" onClick={() => handleStartTest()}>
                      Mulai Test
                    </Button>
                  </Grid>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
      <Dialog open={dialog.isOpen} onClose={handleCloseDialog} maxWidth="lg" scroll="paper">
        <DialogTitle>Tambah Pertanyaan</DialogTitle>
        <DialogContent dividers>
          <form>
            <Grid container direction="row" spacing={3}>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel id="select-question-label">Tipe Pertanyaan</InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select labelId="select-question-label" label="Tipe Pertanyaan" {...field}>
                        <MenuItem value="TEXT">Text</MenuItem>
                        <MenuItem value="IMAGE">Image</MenuItem>
                      </Select>
                    )}
                    name="question_type"
                    control={control}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <Controller
                  render={({ field }) => (
                    <TextField type="number" fullWidth label="Durasi (detik)" variant="outlined" {...field} />
                  )}
                  name="question_duration"
                  control={control}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h5" sx={{ mb: 2 }}>
                  Pertanyaan :
                </Typography>
                <EditorField
                  fieldId={'question'}
                  value={editorValue('question')}
                  onChange={(value) => setValue('question', value)}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h5" sx={{ mb: 2 }}>
                  Jawaban :
                </Typography>
                {getValues('answer_option').map((opt, index) => {
                  return (
                    <Grid item xs={12} key={index} sx={{ mb: 2 }}>
                      <Grid container direction="row" justifyItems="center" spacing={1}>
                        <Grid item xs={1}>
                          <Typography variant="h5">
                            {getAlphabet(index)}.{opt.id}
                          </Typography>
                        </Grid>
                        <Grid item xs={1}>
                          <Controller
                            render={({ field }) => (
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    color="primary"
                                    checked={
                                      watch(`answer_option[${index}].is_correct`) ||
                                      watch(`answer_option[${index}].is_correct`) === 1
                                        ? true
                                        : false
                                    }
                                    {...field}
                                  />
                                }
                              />
                            )}
                            name={`answer_option[${index}].is_correct`}
                            control={control}
                          />
                        </Grid>
                        <Grid item xs={9}>
                          <EditorField
                            fieldId={`answer-${index}`}
                            value={editorValue(`answer_option[${index}].answer`)}
                            onChange={(value) => setValue(`answer_option[${index}].answer`, value)}
                          />
                        </Grid>
                        <Grid item xs={1}>
                          <IconButton onClick={handleDeleteAnswer(index)}>
                            <DeleteRounded color="error" />
                          </IconButton>
                        </Grid>
                      </Grid>
                    </Grid>
                  );
                })}
                <Button variant="contained" color="primary" size="large" fullWidth onClick={handleAddAnswer}>
                  Tambah Jawaban
                </Button>
              </Grid>
            </Grid>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary" variant="outlined" size="large">
            Cancel
          </Button>
          <Button onClick={onSubmit} color="primary" variant="contained" disabled={isFetching} size="large">
            {isFetching && (
              <CircularProgress
                size="small"
                sx={{
                  width: 20,
                  height: 20,
                  marginRight: 1,
                  color: grey[600],
                }}
              />
            )}
            {mode === 'edit' ? 'Simpan' : 'Tambah'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SessionDetail;

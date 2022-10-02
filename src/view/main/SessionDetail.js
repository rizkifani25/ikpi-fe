import { AddRounded, ArrowBackRounded, DeleteRounded } from '@mui/icons-material';
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
import React, { useEffect, useState } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import ReactQuill from 'react-quill';
import { useNavigate, useParams } from 'react-router';
import { handlePostRequest, handlePutRequest } from '../common/api';
import { URL_API_QUESTION_CREATE, URL_API_QUESTION_UPDATE } from '../common/constant';
import useSessionDetail from '../common/hooks/useSessionDetail';
import useSnackbar from '../common/hooks/useSnackbar';
import { readLoginResponse } from '../common/localstorage';
import { convertDate, getAlphabet } from '../common/utils';
import EditorField from './components/EditorField';
import QuestionCard from './QuestionCard';

const SessionDetail = () => {
  const { setAlert } = useSnackbar();
  const navigate = useNavigate();
  const { id } = useParams();
  const { isLoading, detailSession, setDoFetch } = useSessionDetail(id);
  const [mode, setMode] = useState('');
  const [dialog, setDialog] = useState({ isOpen: false });
  const { register, setValue, watch, handleSubmit, control, getValues } = useForm({
    mode: 'all',
    reValidateMode: 'onChange',
    defaultValues: { id_session: id, id: '', question: '', question_type: '', question_duration: 0, answer_option: [] },
  });
  const { append, remove } = useFieldArray({ name: 'answer_option', control });
  const [isProcessing, setIsProcessing] = useState(false);

  const handleOpenDialog = () => {
    setDialog((prevValue) => ({ ...prevValue, isOpen: true }));
  };

  const handleCloseDialog = () => {
    setDialog((prevValue) => ({ ...prevValue, isOpen: false }));
  };

  const onSubmit = handleSubmit((data) => {
    setIsProcessing(true);
    let request = {
      url: URL_API_QUESTION_CREATE,
      data: data,
    };
    if (mode === 'edit') {
      request.url = URL_API_QUESTION_UPDATE;
      request.data = {
        id: data.id,
        question: data.question,
        question_type: data.question_type,
        question_duration: data.question_duration,
        answer: data.answer_option,
      };
      handlePutRequest(request)
        .then((response) => {
          setIsProcessing(false);
          if (response.data.response_code !== 200) {
            setAlert('Terjadi kesalahan tidak terduga. Gagal edit pertanyaan.', 'error');
          } else {
            setDoFetch(true);
            handleCloseDialog();
            setAlert('Sukses edit pertanyaan.', 'success');
          }
        })
        .catch(() => {
          setAlert('Terjadi kesalahan tidak terduga. Gagal edit pertanyaan.', 'error');
        });
    } else {
      handlePostRequest(request)
        .then((response) => {
          setIsProcessing(false);
          if (response.data.response_code !== 200) {
            setAlert('Terjadi kesalahan tidak terduga. Gagal membuat pertanyaan.', 'error');
          } else {
            setDoFetch(true);
            handleCloseDialog();
            setAlert('Sukses membuat pertanyaan.', 'success');
          }
        })
        .catch(() => {
          setAlert('Terjadi kesalahan tidak terduga. Gagal membuat pertanyaan.', 'error');
        });
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

  const handleAddAnswer = () => append({ answer: '', is_correct: false });

  const handleDeleteAnswer = (index) => () => remove(index);

  useEffect(() => {
    register('question');
  }, [register]);

  return (
    <>
      <Toolbar />
      {isLoading && (
        <Box sx={{ maxWidth: 500, margin: '0 auto' }}>
          <Grid container direction="column" alignItems="center" justifyContent="center" sx={{ minHeight: '100vh' }}>
            <CircularProgress color="primary" />
          </Grid>
        </Box>
      )}
      {!isLoading && (
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
                <Typography variant="h5">Peraturan</Typography>
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
                        {detailSession.question &&
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
                    <Button variant="contained" color="primary" size="large">
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
                          <Typography variant="h5">{getAlphabet(index)}.</Typography>
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
          <Button onClick={onSubmit} color="primary" variant="contained" disabled={isProcessing} size="large">
            {isProcessing && (
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

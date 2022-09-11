import React, { useState } from 'react';
import { AddRounded } from '@mui/icons-material';
import { Box, Button, Card, CardContent, Typography } from '@mui/material';
import { useQuestions } from '../common/hooks/useQuestions';
import ReactQuill from 'react-quill';
import { Container } from '@mui/system';
import EditorToolbar, { modules, formats } from './components/EditorToolbar';

const CreateQuestion = () => {
  const questions = useQuestions((state) => state.questions);
  const addQuestions = useQuestions((state) => state.addQuestions);

  const [tmpQuestion, setTmpQuestion] = useState('');

  return (
    <div style={{ marginTop: 10 }}>
      <Box display="flex" flexDirection="row" justifyContent="flex-end">
        <Button variant="contained" endIcon={<AddRounded />} onClick={() => addQuestions(tmpQuestion)}>
          Tambah Pertanyaan
        </Button>
      </Box>
      <Container sx={{ mt: 4 }} maxWidth="md">
        <Card sx={{ minHeight: 400 }}>
          <CardContent>
            <EditorToolbar />
            <ReactQuill
              theme="snow"
              value={tmpQuestion}
              onChange={setTmpQuestion}
              placeholder={'Write something awesome...'}
              modules={modules}
              formats={formats}
              style={{ width: '100%', height: 300 }}
            />
          </CardContent>
        </Card>
      </Container>
      <Typography variant="h5">Result : </Typography>
      {questions.length > 0 &&
        questions.map((q, index) => <ReactQuill key={index} theme="bubble" value={q.name} readOnly={true} />)}
    </div>
  );
};

export default CreateQuestion;

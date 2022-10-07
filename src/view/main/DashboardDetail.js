import { ArrowBackRounded, DownloadRounded, ExpandMoreRounded } from '@mui/icons-material';
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Grid, Toolbar, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router';
import { MOCK_CONTENT } from '../mocks';
import FileSaver from 'file-saver';
import PDFWrapper from './components/PDFWrapper';
import VideoWrapper from './components/VideoWrapper';

const DashboardDetail = () => {
  const navigate = useNavigate();
  const { section } = useParams();

  const handleButtonBack = () => {
    navigate('/lkpi/dashboard/main', { replace: true });
  };

  const fileBaseUrl = `${process.env.PUBLIC_URL}/assets/dashboard/`;

  const handleDownload = (filename) => {
    FileSaver.saveAs(`${fileBaseUrl}${filename}`, filename);
  };

  return (
    <>
      <Toolbar />
      <Grid container sx={{ mt: 2, mb: 4, p: 4 }} spacing={2}>
        <Grid item xs={3}>
          <Button variant="contained" startIcon={<ArrowBackRounded />} onClick={() => handleButtonBack()}>
            Kembali
          </Button>
        </Grid>
        <Grid item xs={12} sx={{ mt: 4 }}>
          <Typography variant="h5">{MOCK_CONTENT[section - 1].label}</Typography>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={2}>
            {MOCK_CONTENT[section - 1].file.map((f, index) => {
              return (
                <Grid key={index} item xs={12}>
                  <Accordion>
                    <AccordionSummary
                      expandIcon={<ExpandMoreRounded />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      <Typography variant="h5" sx={{ ml: 2 }}>
                        {f.filename}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      {f.type === 'pdf' && <PDFWrapper source={f.filename} />}
                      {f.type === 'video' && <VideoWrapper source={f.filename} />}
                      <Box display="flex" direction="row" justifyContent="flex-end" sx={{ mt: 2 }}>
                        <Button
                          variant="contained"
                          startIcon={<DownloadRounded />}
                          onClick={() => handleDownload(f.filename)}
                        >
                          DOWNLOAD
                        </Button>
                      </Box>
                    </AccordionDetails>
                  </Accordion>
                </Grid>
              );
            })}
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default DashboardDetail;

import { ArrowBackRounded, ArrowForwardRounded } from '@mui/icons-material';
import { Alert, Box, Button, Typography } from '@mui/material';
import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

const fileBaseUrl = `${process.env.PUBLIC_URL}/assets/dashboard/`;

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const PDFWrapper = ({ source }) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [isError, setIsError] = useState(false);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const onDocumentLoadError = () => {
    setIsError(true);
  };

  const goToPrevPage = () => setPageNumber(pageNumber - 1 <= 1 ? 1 : pageNumber - 1);

  const goToNextPage = () => setPageNumber(pageNumber + 1 >= numPages ? numPages : pageNumber + 1);

  return (
    <Box>
      <Box display="flex" direction="row" justifyContent="center">
        <Button
          variant="contained"
          disabled={isError}
          startIcon={<ArrowBackRounded />}
          onClick={goToPrevPage}
          sx={{ m: 2 }}
        >
          Sebelumnya
        </Button>
        <Button
          variant="contained"
          disabled={isError}
          startIcon={<ArrowForwardRounded />}
          onClick={goToNextPage}
          sx={{ m: 2 }}
        >
          Selanjutnya
        </Button>
      </Box>
      <Typography variant="body1" textAlign="center">
        Page {pageNumber} of {numPages}
      </Typography>
      <Box display="flex" direction="row" justifyContent="center">
        {isError && (
          <Alert severity="error" sx={{ m: 2 }}>
            Gagal untuk memuat dokumen.
          </Alert>
        )}
        {!isError && (
          <Document
            file={`${fileBaseUrl}${source}`}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
          >
            <Page pageNumber={pageNumber} />
          </Document>
        )}
      </Box>
    </Box>
  );
};

export default PDFWrapper;

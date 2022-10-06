import { useEffect, useState } from 'react';
import { handlePostRequest } from '../api';
import useSnackbar from './useSnackbar';

export default function usePostRequest({ initialData, fetchData }) {
  const { setAlert } = useSnackbar();

  const [doFetch, setDoFetch] = useState(false);
  const [data, setData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const postRequest = () => {
      setDoFetch(true);
      setIsLoading(true);
      handlePostRequest(fetchData)
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

    postRequest();
    setDoFetch(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doFetch]);

  return { data, isLoading, setDoFetch };
}

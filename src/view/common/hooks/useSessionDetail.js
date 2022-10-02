import { useEffect, useState } from 'react';
import { URL_API_SESSION_DETAIL } from '../constant';
import { useSessions } from './useSessions';
import useSnackbar from './useSnackbar';

const { default: axios } = require('axios');

export default function useSessionDetail(sessionId) {
  const { setAlert } = useSnackbar();
  const [doFetch, setDoFetch] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const detailSession = useSessions((state) => state.detailSession);
  const setDetailSession = useSessions((state) => state.setDetailSession);

  useEffect(() => {
    let subscribed = true;
    const getSessionDetail = async (id) => {
      setDoFetch(true);
      const response = await axios.post(URL_API_SESSION_DETAIL, { id_session: id });
      if (response.data.response_code !== 200) {
        setAlert('Terjadi kesalahan tidak terduga. Gagal mendapatkan data.', 'error');
      } else {
        setDetailSession(response.data.data);
      }
      setIsLoading(false);
    };

    return () => {
      if (subscribed) {
        setIsLoading(true);
        getSessionDetail(sessionId);
        setDoFetch(false);
        subscribed = true;
      }
    };
  }, [sessionId, doFetch]);

  return { isLoading, detailSession, setDoFetch };
}

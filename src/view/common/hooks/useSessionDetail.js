import { useEffect, useState } from 'react';
import { handlePostRequest } from '../api';
import { URL_API_SESSION_DETAIL, URL_API_SESSION_DETAIL_USER } from '../constant';
import { readLoginResponse, saveDetailSession } from '../localstorage';
import { useSessions } from './useSessions';
import useSnackbar from './useSnackbar';

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
      const loginRes = readLoginResponse();
      const fetchData = {
        url: loginRes.role_name === 'user' ? URL_API_SESSION_DETAIL_USER : URL_API_SESSION_DETAIL,
        data: {
          id_session: sessionId,
          id_user: loginRes.id,
        },
      };
      handlePostRequest(fetchData)
        .then((response) => {
          setIsLoading(false);
          if (response.data.response_code !== 200) {
            setAlert('Terjadi kesalahan tidak terduga. Gagal mendapatkan data.', 'error');
          } else {
            setDetailSession(response.data.data);
            saveDetailSession(response.data.data);
          }
        })
        .catch(() => {
          setIsLoading(false);
          setAlert('Terjadi kesalahan tidak terduga. Gagal mendapatkan data.', 'error');
        });
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

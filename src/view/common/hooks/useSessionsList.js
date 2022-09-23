import { useQuery } from 'react-query';
import { URL_API_SESSION_GET_LIST } from '../constant';
import { useSessions } from './useSessions';
import useSnackbar from './useSnackbar';

const { default: axios } = require('axios');

const getSessionList = async () => {
  const response = await axios.get(URL_API_SESSION_GET_LIST);
  return response.data;
};

export default function useSessionsList() {
  const { setAlert } = useSnackbar();
  const setSessions = useSessions((state) => state.setSessions);

  const { isFetching, data } = useQuery('sessionList', getSessionList, {
    onSuccess: (response) => {
      setSessions(response.data);
    },
    onError: () => {
      setAlert('Terjadi kesalahan tidak terduga. Gagal mendapatkan data.', 'error');
    },
  });

  return { isFetching, data };
}

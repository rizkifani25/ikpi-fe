const BASE_API =
  process.env.REACT_APP_PRODUCTION === 'true' ? process.env.REACT_APP_MEELPO_API : 'http://localhost:3030';

const LKPI_SERVICE_BASE = '/lkpi-service';

const API_V1 = `${BASE_API}${LKPI_SERVICE_BASE}/api/v1`;

const API_SESSION = `${API_V1}/session`;

exports.URL_API_SESSION_GET_LIST = `${API_SESSION}/get-list`;
exports.URL_API_SESSION_CREATE = `${API_SESSION}/create`;
exports.URL_API_SESSION_DETAIL = `${API_SESSION}/get-detail`;

exports.LOCALSTORAGE_LOGIN_RESPONSE = 'loginRes';

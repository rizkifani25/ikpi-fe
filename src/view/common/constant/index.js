const BASE_API =
  process.env.REACT_APP_PRODUCTION === 'true' ? process.env.REACT_APP_MEELPO_API : 'http://localhost:3030';

const LKPI_SERVICE_BASE = '/lkpi-service';

const API_V1 = `${BASE_API}${LKPI_SERVICE_BASE}/api/v1`;

const API_USER = `${API_V1}/user`;
exports.URL_API_USER_LOGIN = `${API_USER}/login`;

const API_SESSION = `${API_V1}/session`;
exports.URL_API_SESSION_GET_LIST = `${API_SESSION}/get-list`;
exports.URL_API_SESSION_CREATE = `${API_SESSION}/create`;
exports.URL_API_SESSION_DETAIL = `${API_SESSION}/get-detail`;

const API_QUESTION = `${API_V1}/question`;
exports.URL_API_QUESTION_CREATE = `${API_QUESTION}/create`;
exports.URL_API_QUESTION_UPDATE = `${API_QUESTION}/update-question-answer`;

exports.LOCALSTORAGE_LOGIN_RESPONSE = 'loginRes';

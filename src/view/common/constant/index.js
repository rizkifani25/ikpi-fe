const BASE_API =
  process.env.REACT_APP_PRODUCTION === 'true' ? process.env.REACT_APP_MEELPO_API : 'http://localhost:3030';

const LKPI_SERVICE_BASE = '/lkpi-service';

const API_V1 = `${BASE_API}${LKPI_SERVICE_BASE}/api/v1`;

const API_USER = `${API_V1}/user`;
exports.URL_API_USER_LOGIN = `${API_USER}/login`;
exports.URL_API_GET_USERS = `${API_USER}/get-list`;
exports.URL_API_CREATE_USERS = `${API_USER}/create`;
exports.URL_API_UPDATE_USER = `${API_USER}/update-by-id`;

const API_SESSION = `${API_V1}/session`;
exports.URL_API_SESSION_GET_LIST = `${API_SESSION}/get-list`;
exports.URL_API_SESSION_CREATE = `${API_SESSION}/create`;
exports.URL_API_SESSION_DETAIL = `${API_SESSION}/get-detail`;
exports.URL_API_SESSION_DETAIL_USER = `${API_SESSION}/get-user-detail-session`;
exports.URL_API_SESSION_UPDATE = `${API_SESSION}/update-by-id`;

const API_QUESTION = `${API_V1}/question`;
exports.URL_API_QUESTION_CREATE = `${API_QUESTION}/create`;
exports.URL_API_QUESTION_UPDATE = `${API_QUESTION}/update-question-answer`;
exports.URL_API_QUESTION_GET_USER = `${API_QUESTION}/get-by-id`;

const API_ANSWER = `${API_V1}/answer`;
exports.URL_API_ANSWER_STORE = `${API_ANSWER}/store-user-answer`;

const API_RESULT = `${API_V1}/result`;
exports.URL_API_STORE_RESULT = `${API_RESULT}/store-user-result`;
exports.URL_API_GET_RESULT = `${API_RESULT}/get-result`;

exports.LOCALSTORAGE_LOGIN_RESPONSE = 'loginRes';
exports.LOCALSTORAGE_DETAIL_SESSION = 'detailSession';

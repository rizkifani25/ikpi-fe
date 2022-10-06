import { LOCALSTORAGE_DETAIL_SESSION, LOCALSTORAGE_LOGIN_RESPONSE } from './constant';

export const readLoginResponse = () => {
  return JSON.parse(localStorage.getItem(LOCALSTORAGE_LOGIN_RESPONSE));
};

export const saveLoginResponse = (data) => {
  localStorage.setItem(LOCALSTORAGE_LOGIN_RESPONSE, JSON.stringify(data));
};

export const removeLoginResponse = () => {
  localStorage.removeItem(LOCALSTORAGE_LOGIN_RESPONSE);
};

export const readDetailSession = () => {
  return JSON.parse(localStorage.getItem(LOCALSTORAGE_DETAIL_SESSION));
};

export const saveDetailSession = (data) => {
  localStorage.setItem(LOCALSTORAGE_DETAIL_SESSION, JSON.stringify(data));
};

export const removeDetailSession = () => {
  localStorage.removeItem(LOCALSTORAGE_DETAIL_SESSION);
};

const dayjs = require('dayjs');
require('dayjs/locale/id');

dayjs.locale('id');

export const convertDate = (date, format) => {
  return dayjs(date).format(format);
};

export const getDifferentMinutes = (dateStart, dateFinish) => {
  var diff = (dateStart - dateFinish) / 1000;
  diff /= 60;
  return Math.abs(Math.round(diff));
};

const alphabet = [
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z',
];

export const getAlphabet = (index) => {
  return alphabet[index];
};

export const generateRandomString = (length) => {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

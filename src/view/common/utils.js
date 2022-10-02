const dayjs = require('dayjs');
require('dayjs/locale/id');

dayjs.locale('id');

export const convertDate = (date, format) => {
  return dayjs(date).format(format);
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

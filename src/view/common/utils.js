const dayjs = require('dayjs');

dayjs.locale('id');

export const convertDate = (date, format) => {
  return dayjs(date).format(format);
};

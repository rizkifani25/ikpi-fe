const dayjs = require('dayjs');
require('dayjs/locale/id');

dayjs.locale('id');

export const convertDate = (date, format) => {
  return dayjs(date).format(format);
};

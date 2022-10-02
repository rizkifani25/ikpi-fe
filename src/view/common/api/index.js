const { default: axios } = require('axios');

export const handlePostRequest = (data) => {
  return axios.post(data.url, data.data, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const handlePutRequest = (data) => {
  return axios.put(data.url, data.data, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const handleGetRequest = (data) => {
  return axios.get(data.url, {
    params: data.params,
  });
};

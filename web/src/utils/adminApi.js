import axios from 'axios';

const adminApi = axios.create({
  basUrl: '',
  headers: {
    'Content-type': 'application/json; charset=UTF-8',
  },
});

export default adminApi;
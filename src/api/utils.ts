import Axios from 'axios';

export const BASE_URL = process.env.NODE_ENV === 'production'
  ? `http://${window.location.host}/api`
  : 'http://localhost:7000/api';

export const axios = Axios.create({
  validateStatus: status => status >= 200 && status < 500,
  withCredentials: true,
  timeout: 5000,
});

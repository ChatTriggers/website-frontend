import { default as Axios } from 'axios';

// export const BASE_URL = `${window.location.protocol}//${window.location.host}/api`;
export const BASE_URL = 'http://localhost:7000/api';

export const axios = Axios.create({
  validateStatus: status => status >= 200 && status < 500,
  withCredentials: true,
  timeout: 5000
});

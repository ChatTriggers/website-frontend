import { default as Axios, AxiosResponse } from 'axios';

// export const BASE_URL = `${window.location.protocol}//${window.location.host}/api`;
export const BASE_URL = 'http://localhost:7000/api';

export const throwErr = (funcName: string, response: AxiosResponse<unknown>): never => {
  throw new Error(`[${funcName}] Unexpected response status: ${response.status}\nFull response: ${JSON.stringify(response, undefined, 2)}`);
};

export const axios = Axios.create({
  validateStatus: status => status >= 200 && status < 500
});

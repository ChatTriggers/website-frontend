import { AxiosResponse } from 'axios';

export * from './auth';
export * from './modules';
export * from './Result';

import * as ApiErrors from './ApiErrors';
export { ApiErrors };

export const BASE_URL = `${window.location.origin}//${window.location.host}/api/`;

export const throwErr = (funcName: string, response: AxiosResponse<unknown>): never => {
  throw new Error(`[${funcName}] Unexpected response status: ${response.status}\nFull response: ${JSON.stringify(response, undefined, 2)}`);
};

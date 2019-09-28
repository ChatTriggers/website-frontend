import qs from 'querystring';
import { IUser, IPersonalUser } from '~types';
import { ApiErrors, validateStatusCode } from './ApiErrors';
import { axios, BASE_URL } from '../utils';

const ACCOUNT_LOGIN_URL = `${BASE_URL}/account/login`;
const ACCOUNT_LOGOUT_URL = `${BASE_URL}/account/logout`;
const ACCOUNT_NEW_URL = `${BASE_URL}/account/new`;
const ACCOUNT_CURRENT_URL = `${BASE_URL}/account/current`;
const ACCOUNT_RESET_REQUEST = `${BASE_URL}/account/resets/request`;
const ACCOUNT_RESET_COMPLETE = `${BASE_URL}/account/resets/complete`;

export const login = async (
  username: string,
  password: string,
): Promise<IUser> => {
  const response = await axios.post<IUser>(ACCOUNT_LOGIN_URL, qs.stringify({
    username,
    password,
  }));

  return validateStatusCode(response, {
    200: () => response.data,
    401: () => { throw ApiErrors.Login.AUTH_FAILED(response.statusText); },
  });
};

export const logout = async (): Promise<undefined> => {
  const response = await axios.get<undefined>(ACCOUNT_LOGOUT_URL);

  return validateStatusCode(response, {
    200: () => response.data,
  });
};

export const createAccount = async (
  username: string,
  password: string,
  email: string,
): Promise<IUser> => {
  const response = await axios.post<IUser>(ACCOUNT_NEW_URL, qs.stringify({
    username,
    password,
    email,
  }));

  return validateStatusCode(response, {
    201: () => response.data,
    409: () => {
      switch (response.statusText as '1' | '2' | '3') {
        case '1':
          throw ApiErrors.CreateAccount.USER_ALREADY_AUTHED(response.statusText);
        case '2':
          throw ApiErrors.CreateAccount.NAME_IN_USE(response.statusText);
        case '3':
          throw ApiErrors.CreateAccount.EMAIL_IN_USE(response.statusText);
        default:
          throw new Error('Unexpected response.statusText');
      }
    },
  });
};

export const getCurrentAccount = async (): Promise<IPersonalUser> => {
  const response = await axios.get<IPersonalUser>(ACCOUNT_CURRENT_URL);

  return validateStatusCode(response, {
    200: () => response.data,
    404: () => { throw ApiErrors.CurrentAccount.NO_ACTIVE_ACCOUNT(response.statusText); },
  });
};

export const requestPasswordReset = async (email: string): Promise<undefined> => {
  const response = await axios.get(ACCOUNT_RESET_REQUEST, {
    params: {
      email,
    },
  });

  return validateStatusCode(response, {
    200: () => undefined,
    401: () => { throw ApiErrors.PasswordResetRequest.ALREADY_LOGGED_IN(response.statusText); },
  });
};

export const requestPasswordComplete = async (
  password: string,
  token: string,
): Promise<unknown> => {
  const response = await axios.post(ACCOUNT_RESET_COMPLETE, qs.stringify({
    password,
    token,
  }));

  return validateStatusCode(response, {
    200: () => response.data,
    400: () => { throw ApiErrors.PasswordResetComplete.REQUEST_ISSUE(response.statusText); },
    401: () => { throw ApiErrors.PasswordResetComplete.ALREADY_LOGGED_IN(response.statusText); },
  });
};

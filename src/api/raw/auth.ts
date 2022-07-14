import { IPersonalUser, IUser } from '~types';

import { axios, BASE_URL, URLParams } from '../utils';
import { ApiErrors, validateStatusCode } from './ApiErrors';

const ACCOUNT_LOGIN_URL = `${BASE_URL}/account/login`;
const ACCOUNT_LOGOUT_URL = `${BASE_URL}/account/logout`;
const ACCOUNT_NEW_URL = `${BASE_URL}/account/new`;
const ACCOUNT_CURRENT_URL = `${BASE_URL}/account/current`;
const ACCOUNT_RESET_REQUEST = `${BASE_URL}/account/resets/request`;
const ACCOUNT_RESET_COMPLETE = `${BASE_URL}/account/resets/complete`;

export const login = async (username: string, password: string): Promise<IUser> => {
  const response = await axios.post<IUser>(
    ACCOUNT_LOGIN_URL,
    new URLParams({ username, password }).toString(),
  );

  return validateStatusCode(response, ApiErrors.Login);
};

export const logout = async (): Promise<undefined> => {
  const response = await axios.get<undefined>(ACCOUNT_LOGOUT_URL);

  return validateStatusCode(response);
};

export const createAccount = async (
  username: string,
  password: string,
  email: string,
): Promise<IUser> => {
  const response = await axios.post<IUser>(
    ACCOUNT_NEW_URL,
    new URLParams({ username, password, email }).toString(),
  );

  return validateStatusCode(response, (): string | undefined => {
    switch (response.statusText as '1' | '2' | '3') {
      case '1':
        return 'The user is already logged in';
      case '2':
        return 'The specified name is already in use';
      case '3':
        return 'The specified email is already in use';
      default:
        return undefined;
    }
  });
};

export const getCurrentAccount = async (): Promise<IPersonalUser> => {
  const response = await axios.get<IPersonalUser>(ACCOUNT_CURRENT_URL);

  return validateStatusCode(response, ApiErrors.CurrentAccount);
};

export const requestPasswordReset = async (email: string): Promise<undefined> => {
  const response = await axios.get(ACCOUNT_RESET_REQUEST, {
    params: {
      email,
    },
  });

  return validateStatusCode(response, ApiErrors.PasswordResetRequest);
};

export const requestPasswordComplete = async (
  password: string,
  token: string,
): Promise<unknown> => {
  const response = await axios.post(
    ACCOUNT_RESET_COMPLETE,
    new URLParams({ password, token }).toString(),
  );

  return validateStatusCode(response, ApiErrors.PasswordResetComplete);
};

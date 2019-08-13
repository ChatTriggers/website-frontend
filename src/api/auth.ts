import axios from 'axios';
import { BASE_URL, Result, IResult, ApiErrors, throwErr } from '.';

export interface IUser {
  id: number;
  name: string;
  rank: 'default' | 'trusted' | 'admin';
}

const ACCOUNT_LOGIN_URL = `${BASE_URL}/accounts/login`;
const ACCOUNT_LOGOUT_URL = `${BASE_URL}/accounts/logout`;
const ACCOUNT_NEW_URL = `${BASE_URL}/accounts/new`;
const ACCOUNT_CURRENT_URL = `${BASE_URL}/accounts/current`;

export const getCurrentUser = async (): Promise<IResult<IUser, ApiErrors.CurrentUser>> => {
  const response = await axios.get(ACCOUNT_CURRENT_URL);

  switch (response.status) {
    case 200:
      return Result.Ok(JSON.parse(response.data) as IUser);
    case 404:
      return Result.Err(ApiErrors.NO_CURRENT_USER);
    default:
      return throwErr('getCurrentUser', response);
  }
};

export const login = async (username: string, password: string): Promise<IResult<IUser, ApiErrors.Login>> => {
  const userResponse = await getCurrentUser();

  if (userResponse.ok) {
    return Result.Ok(userResponse.value);
  }

  const response = await axios.post(ACCOUNT_LOGIN_URL, {
    username,
    password
  });

  switch (response.status) {
    case 200:
      return Result.Ok(JSON.parse(response.data) as IUser);
    case 401:
      return Result.Err(ApiErrors.AUTHENTICATION_FAILED);
    default:
      return throwErr('login', response);
  }
};

export const createUser = async (email: string, username: string, password: string): Promise<IResult<0, ApiErrors.CreateUser>> => {
  const response = await axios.post(ACCOUNT_NEW_URL, {
    email,
    username,
    password
  });

  switch (response.status) {
    case 201:
      return Result.Ok(0);
    case 409:
      // 1: already logged in
      // 2: name is already in use
      // 3: email is already in use
      switch (response.data as 1 | 2 | 3) {
        case 1: return Result.Err(ApiErrors.USER_ALREADY_AUTHED);
        case 2: return Result.Err(ApiErrors.NAME_TAKEN);
        case 3: return Result.Err(ApiErrors.EMAIL_TAKEN);
        default: throw new Error('impossible');
      }
    default:
      return throwErr('createUser', response);
  }
};

export const logout = async () => {
  const response = await axios.get(ACCOUNT_LOGOUT_URL);

  switch (response.status) {
    case 200: break;
    default:
      throwErr('logout', response);
  }
};

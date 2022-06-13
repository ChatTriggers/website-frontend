import { AxiosResponse } from 'axios';

export const ApiErrors = {
  GetModule: {
    400: 'moduleId is not an integer',
    404: 'No module with moduleId found',
  },
  UpdateModule: {
    400: 'One of: moduleId is not an integer, image is not an imgur link, hidden is not a boolean',
    403: 'User does not have permission to edit this module',
    404: 'No module with moduleId found',
  },
  DeleteModule: {
    400: 'moduleId is not an integer',
    403: 'User does not have permission',
    404: 'No module with moduleId found',
  },
  Login: {
    401: 'Authentication failed',
  },
  CurrentAccount: {
    404: 'There is no currently active account',
  },
  PasswordResetRequest: {
    401: 'The account in question is already logged in',
  },
  PasswordResetComplete: {
    400: 'The was an issue with the request',
    401: 'The account in question is already logged in',
  },
  CreateRelease: {
    400: 'One of the request parameters is malformed',
  },
  UpdateRelease: {
    400: 'Part of the data is not the correct type',
    403: 'User does not have permission to edit this module',
    404: 'No module with the given moduleId found',
  },
  DeleteRelease: {
    400: 'Part of the data is not the correct type',
    403: 'User does not have permission to edit this module',
    404: 'No module with the given moduleId found',
  },
  ToggleTrust: {
    403: 'User not authorized',
    404: 'No user with specified user-id found',
  },
  Versions: {},
};

type ErrorObj =
  | {
      [error: number]: string;
    }
  | (() => string | undefined);

export const validateStatusCode = <T>(
  response: AxiosResponse<T>,
  errors?: ErrorObj,
  returnFunc: () => T = () => response.data,
): T => {
  if (response.status >= 200 && response.status < 300) {
    return returnFunc();
  }

  switch (typeof errors) {
    case 'object':
      throw new Error(
        errors[response.status] ||
          `Received unrecognized status code from api endpoint: ${response.status}`,
      );
    case 'function': {
      const errorMsg = errors();

      if (errorMsg) {
        throw new Error(errorMsg);
      } else {
        throw new Error(`Received unsuccessful response, but the provided error function returned undefined.
          \tResponse: ${response.status} - ${response.statusText}
        `);
      }
    }
    case 'undefined':
    default:
      throw new Error(
        `Received unexpected error status code from api endpoint: ${response.status}: ${response.statusText}`,
      );
  }
};

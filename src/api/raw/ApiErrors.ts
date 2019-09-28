import { AxiosResponse } from 'axios';

const ApiErrorsDesc = {
  GetModule: {
    MALFORMED_MODULE_ID: 'moduleId is not an integer',
    MODULE_NOT_FOUND: 'No module with moduleId found',
  },
  UpdateModule: {
    MALFORMED_DATA: 'One of: moduleId is not an integer, image is not an imgur link, hidden is not a boolean',
    NO_PERMISSION: 'User does not have permission to edit this module',
    MODULE_NOT_FOUND: 'No module with moduleId found',
  },
  DeleteModule: {
    MALFORMED_MODULE_ID: 'moduleId is not an integer',
    NO_PERMISSION: 'User does not have permission',
    MODULE_NOT_FOUND: 'No module with moduleId found',
  },
  Login: {
    AUTH_FAILED: 'Authentication failed',
  },
  CreateAccount: {
    USER_ALREADY_AUTHED: 'The user is already logged in',
    NAME_IN_USE: 'The specified name is already in use',
    EMAIL_IN_USE: 'The specified email is already in use',
  },
  CurrentAccount: {
    NO_ACTIVE_ACCOUNT: 'There is no currently active account',
  },
  PasswordResetRequest: {
    ALREADY_LOGGED_IN: 'The account in question is already logged in',
  },
  PasswordResetComplete: {
    REQUEST_ISSUE: 'The was an issue with the request',
    ALREADY_LOGGED_IN: 'The account in question is already logged in',
  },
  CreateRelease: {
    MALFORMED_DATA: 'One of the request parameters is malformed',
  },
  UpdateRelease: {
    MALFORMED_DATA: 'Part of the data is not the correct type',
    NO_PERMISSION: 'User does not have permission to edit this module',
    MODULE_NOT_FOUND: 'No module with the given moduleId found',
  },
  DeleteRelease: {
    MALFORMED_DATA: 'Part of the data is not the correct type',
    NO_PERMISSION: 'User does not have permission to edit this module',
    MODULE_NOT_FOUND: 'No module with the given moduleId found',
  },
};

type ApiErrorsFunc = {
  [K1 in keyof typeof ApiErrorsDesc]: {
    [K2 in keyof typeof ApiErrorsDesc[K1]]: (responseText: string) => {
      type: string;
      description: string;
      responseText: string;
    };
  };
} & {
  UNKNOWN_RESPONSE_CODE(responseCode: number): string;
};

export const ApiErrors = Object.keys(ApiErrorsDesc).reduce((prev, curr) => ({
  ...prev,
  [curr]: Object.entries(ApiErrorsDesc[curr as keyof typeof ApiErrorsDesc]).reduce((prev2, [key, desc]) => ({
    ...prev2,
    [key]: (responseText: string) => ({
      type: key,
      description: desc,
      responseText,
    }),
  }), {} as unknown as ApiErrorsFunc),
}), {
  UNKNOWN_RESPONSE_CODE: (statusCode: number) => `Received unrecognized status code from api endpoint: ${statusCode}`,
}) as unknown as ApiErrorsFunc;

export const validateStatusCode = <T>(response: AxiosResponse, validator: {
  [code: number]: () => T;
}): T => {
  if (!Object.keys(validator).includes(response.status.toString())) {
    throw ApiErrors.UNKNOWN_RESPONSE_CODE(response.status);
  }

  return validator[response.status]();
};

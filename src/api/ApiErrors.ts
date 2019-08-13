export const NO_CURRENT_USER = 'NO_CURRENT_USER';

export const AUTHENTICATION_FAILED = 'AUTHENTICATION_FAILED';

export const USER_ALREADY_AUTHED = 'USER_ALREADY_AUTHED';
export const NAME_TAKEN = 'NAME_TAKEN';
export const EMAIL_TAKEN = 'EMAIL_TAKEN';

export const MALFORMED_MODULE_ID = 'MALFORMED_MODULE_ID';
export const MODULE_NOT_FOUND = 'MODULE_NOT_FOUND';

export type CurrentUser = typeof NO_CURRENT_USER;
export type Login = typeof AUTHENTICATION_FAILED;
export type CreateUser = 
  typeof USER_ALREADY_AUTHED |
  typeof NAME_TAKEN |
  typeof EMAIL_TAKEN;
export type GetModule = typeof MALFORMED_MODULE_ID | typeof MODULE_NOT_FOUND;

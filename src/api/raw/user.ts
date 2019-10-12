import { ApiErrors, validateStatusCode } from './ApiErrors';
import { axios, BASE_URL } from '../utils';

const USER_TRUST_URL = (userId: number): string => `${BASE_URL}/user/${userId}/trust`;

// eslint-disable-next-line import/prefer-default-export
export const toggleTrust = async (userId: number): Promise<void> => {
  const response = await axios.post<undefined>(USER_TRUST_URL(userId));

  return validateStatusCode(response, ApiErrors.ToggleTrust);
};

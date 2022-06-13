import { axios, BASE_URL } from '../utils';
import { ApiErrors, validateStatusCode } from './ApiErrors';

const userTrustUrl = (userId: number) => `${BASE_URL}/user/${userId}/trust`;

export const toggleTrust = async (userId: number): Promise<void> => {
  const response = await axios.post<undefined>(userTrustUrl(userId));

  return validateStatusCode(response, ApiErrors.ToggleTrust);
};

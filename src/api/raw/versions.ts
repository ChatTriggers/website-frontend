import { axios, BASE_URL } from '../utils';
import { validateStatusCode, ApiErrors } from './ApiErrors';

const VERSIONS_URL = `${BASE_URL}/versions`;

const getVersions = async (): Promise<string[]> => {
  const response = await axios.get<string[]>(VERSIONS_URL);

  return validateStatusCode(response, ApiErrors.Versions);
};

// eslint-disable-next-line import/prefer-default-export
export { getVersions };

import { axios, BASE_URL } from '../utils';
import { validateStatusCode, ApiErrors } from './ApiErrors';
import { IRawVersions } from '~src/types';

const VERSIONS_URL = `${BASE_URL}/versions`;

const getVersions = async (): Promise<IRawVersions> => {
  const response = await axios.get<IRawVersions>(VERSIONS_URL);

  return validateStatusCode(response, ApiErrors.Versions);
};

// eslint-disable-next-line import/prefer-default-export
export { getVersions };

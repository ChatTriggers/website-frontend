import { IRawVersions } from '~types';

import { axios, BASE_URL } from '../utils';
import { ApiErrors, validateStatusCode } from './ApiErrors';

const VERSIONS_URL = `${BASE_URL}/versions?modVersion=all`;

const getVersions = async (): Promise<IRawVersions> => {
  const response = await axios.get<IRawVersions>(VERSIONS_URL);

  return validateStatusCode(response, ApiErrors.Versions);
};

export { getVersions };

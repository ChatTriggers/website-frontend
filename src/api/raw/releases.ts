import FormData from 'form-data';
import qs from 'querystring';
import { IRelease } from '~types';
import { axios, BASE_URL } from '../utils';
import { ApiErrors, validateStatusCode } from './ApiErrors';

const RELEASES_URL = (moduleId: number): string => `${BASE_URL}/modules/${moduleId}/releases`;
const RELEASES_URL_SPECIFIC = (moduleId: number, releaseId: string): string => `${BASE_URL}/modules/${moduleId}/releases/${releaseId}`;

export const createRelease = async (
  moduleId: number,
  releaseVersion: string,
  modVersion: string,
  file: File,
  changelog?: string,
): Promise<IRelease> => {
  const formData = new FormData();
  formData.append('releaseVersion', releaseVersion);
  formData.append('modVersion', modVersion);
  formData.append('module', file);

  if (changelog) formData.append('changelog', changelog);

  const response = await axios({
    method: 'post',
    url: RELEASES_URL(moduleId),
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return validateStatusCode(response, ApiErrors.CreateRelease);
};

export const updateRelease = async (
  moduleId: number,
  releaseId: string,
  modVersion?: string,
  changelog?: string,
): Promise<undefined> => {
  if (!modVersion && !changelog) return undefined;

  const params = qs.stringify({ modVersion, changelog });
  const response = await axios.patch<undefined>(RELEASES_URL_SPECIFIC(moduleId, releaseId), params);

  return validateStatusCode(response, ApiErrors.UpdateRelease);
};

export const deleteRelease = async (
  moduleId: number,
  releaseId: string,
): Promise<undefined> => {
  const response = await axios.delete<undefined>(RELEASES_URL_SPECIFIC(moduleId, releaseId));

  return validateStatusCode(response, ApiErrors.DeleteRelease);
};

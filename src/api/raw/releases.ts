import FormData from 'form-data';
import qs from 'querystring';
import { axios, BASE_URL } from '..';
import { ApiErrors } from '.';
import { validateStatusCode } from './ApiErrors';

export interface IRelease {
  id: string;
  releaseVersion: string;
  modVersion: string;
  changelog: string;
  downloads: number;
  scripts: File | undefined;
}

const RELEASES_URL = (moduleId: number) => `${BASE_URL}/modules/${moduleId}/releases`;
const RELEASES_URL_SPECIFIC = (moduleId: number, releaseId: string) => `${BASE_URL}/modules/${moduleId}/releases/${releaseId}`;

export const createRelease = async (
  moduleId: number,
  releaseVersion: string,
  modVersion: string,
  file: File,
  changelog?: string
): Promise<IRelease> => {
  const formData = new FormData();
  formData.append('releaseVersion', releaseVersion);
  formData.append('modVersion', modVersion);
  formData.append('module', file);

  if (changelog)
    formData.append('changelog', changelog);

  const response = await axios.post<IRelease>(RELEASES_URL(moduleId), formData);

  return validateStatusCode(response, {
    201: () => response.data,
    400: () => { throw ApiErrors.CreateRelease.MALFORMED_DATA(response.statusText); }
  });
};

export const updateRelease = async (
  moduleId: number,
  releaseId: string,
  modVersion?: string,
  changelog?: string
) => {
  if (!modVersion && !changelog) return;

  const params = qs.stringify({ modVersion, changelog });
  const response = await axios.patch<undefined>(RELEASES_URL_SPECIFIC(moduleId, releaseId), params);

  return validateStatusCode(response, {
    200: () => undefined,
    400: () => { throw ApiErrors.UpdateRelease.MALFORMED_DATA(response.statusText); },
    403: () => { throw ApiErrors.UpdateRelease.NO_PERMISSION(response.statusText); },
    404: () => { throw ApiErrors.UpdateRelease.MODULE_NOT_FOUND(response.statusText); }
  });
};

export const deleteRelease = async (
  moduleId: number,
  releaseId: string
) => {
  const response = await axios.delete<undefined>(RELEASES_URL_SPECIFIC(moduleId, releaseId));

  return validateStatusCode(response, {
    200: () => undefined,
    400: () => { throw ApiErrors.DeleteRelease.MALFORMED_DATA(response.statusText); },
    403: () => { throw ApiErrors.DeleteRelease.NO_PERMISSION(response.statusText); },
    404: () => { throw ApiErrors.DeleteRelease.MODULE_NOT_FOUND(response.statusText); }
  });
};

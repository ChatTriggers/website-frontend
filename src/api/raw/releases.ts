import FormData from 'form-data';
import { axios, BASE_URL } from '..';
import { ApiErrors } from '.';
import { validateStatusCode } from './ApiErrors';

export interface IRelease {
  id: string;
  releaseVersion: string;
  modVersion: string;
  changelog: string;
  downloads: number;
}

const RELEASES_URL = (moduleId: number) => `${BASE_URL}/modules/${moduleId}/releases`;

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

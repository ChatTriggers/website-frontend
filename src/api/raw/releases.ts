import FormData from 'form-data';

import { IRelease } from '~types';

import { axios, BASE_URL, URLParams } from '../utils';
import { ApiErrors, validateStatusCode } from './ApiErrors';

const releasesUrl = (moduleId: string) => `${BASE_URL}/modules/${moduleId}/releases`;

const releasesUrlSpecific = (moduleId: string, releaseId: string) =>
  `${BASE_URL}/modules/${moduleId}/releases/${releaseId}`;

const verifyUrl = (moduleId: string, releaseId: string) =>
  `${BASE_URL}/modules/${moduleId}/releases/${releaseId}/verify`;

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
    url: releasesUrl(moduleId.toString()),
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return validateStatusCode(response, ApiErrors.CreateRelease);
};

export const getReleaseScript = async (
  moduleId: string,
  releaseId: string,
): Promise<Blob> => {
  const url = `${releasesUrlSpecific(moduleId, releaseId)}?file=scripts`;
  const response = await axios.get<Blob>(url, { responseType: 'blob' });
  return validateStatusCode(response);
};

export const getRelease = async (
  moduleId: string,
  releaseId: string,
): Promise<IRelease> => {
  const response = await axios.get<IRelease>(releasesUrlSpecific(moduleId, releaseId));
  return validateStatusCode(response);
};

export const verifyRelease = async (
  moduleId: string,
  releaseId: string,
  token: string,
): Promise<void> => {
  const response = await axios.get<void>(
    `${verifyUrl(moduleId, releaseId)}?verificationToken=${token}`,
  );
  validateStatusCode(response);
};

export const updateRelease = async (
  moduleId: number,
  releaseId: string,
  modVersion?: string,
  changelog?: string,
): Promise<undefined> => {
  const searchParams = new URLParams({ modVersion, changelog });

  const response = await axios.patch<undefined>(
    releasesUrlSpecific(moduleId.toString(), releaseId),
    searchParams.toString(),
  );

  return validateStatusCode(response, ApiErrors.UpdateRelease);
};

export const deleteRelease = async (
  moduleId: number,
  releaseId: string,
): Promise<undefined> => {
  const response = await axios.delete<undefined>(
    releasesUrlSpecific(moduleId.toString(), releaseId),
  );

  return validateStatusCode(response, ApiErrors.DeleteRelease);
};

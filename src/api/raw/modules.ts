import qs from 'querystring';
import { axios } from '..';
import { IUser, ApiErrors, validateStatusCode, IRelease } from '.';
import { BASE_URL } from '../utils';

export interface IModule {
  id: number;
  name: string;
  owner: IUser;
  description: string;
  image: string;
  tags: string[];
  downloads: number;
  releases: IRelease[];
}

export interface IModuleMetadata {
  limit: number;
  offset: number;
  total: number;
}

export interface IModuleResponse {
  meta: IModuleMetadata;
  modules: IModule[];
}

const MODULES_URL = `${BASE_URL}/modules`;
const MODULE_ID_URL = (id: number) => `${BASE_URL}/modules/${id}`;

export const getModules = async (
  limit?: number,
  offset?: number,
  owner?: number,
  trusted?: boolean,
  flagged?: boolean,
  tag?: string,
  q?: string
): Promise<IModuleResponse> => {
  const response = await axios.get<IModuleResponse>(MODULES_URL, {
    params: {
      limit,
      offset,
      owner,
      trusted,
      flagged,
      tag,
      q
    }
  });

  return validateStatusCode(response, {
    200: () => response.data
  });
};

export const createModule = async (
  name: string,
  description: string,
  tags: string[],
  image?: string
): Promise<IModule> => {
  const response = await axios.post<IModule>(MODULES_URL, qs.stringify({
    name,
    description,
    tags,
    image
  }));

  return validateStatusCode(response, {
    201: () => response.data
  });
};

export const getSingleModule = async (
  moduleId: number
): Promise<IModule> => {
  const response = await axios.get<IModule>(MODULE_ID_URL(moduleId));

  return validateStatusCode(response, {
    200: () => response.data,
    400: () => { throw ApiErrors.GetModule.MALFORMED_MODULE_ID(response.statusText); },
    404: () => { throw ApiErrors.GetModule.MODULE_NOT_FOUND(response.statusText); }
  });
};

export const updateModule = async (
  moduleId: number,
  description?: string,
  image?: string,
  flagged?: boolean,
  tags?: string[]
): Promise<IModule> => {
  const response = await axios.patch<IModule>(MODULE_ID_URL(moduleId), qs.stringify({
    description,
    image,
    flagged,
    tags
  }));

  return validateStatusCode(response, {
    200: () => response.data,
    400: () => { throw ApiErrors.UpdateModule.MALFORMED_DATA(response.statusText); },
    403: () => { throw ApiErrors.UpdateModule.NO_PERMISSION(response.statusText); },
    404: () => { throw ApiErrors.UpdateModule.MODULE_NOT_FOUND(response.statusText); }
  });
};

export const deleteModule = async (
  moduleId: number,
): Promise<undefined> => {
  const response = await axios.delete<undefined>(MODULE_ID_URL(moduleId));

  return validateStatusCode(response, {
    200: () => undefined,
    400: () => { throw ApiErrors.DeleteModule.MALFORMED_MODULE_ID(response.statusText); },
    403: () => { throw ApiErrors.DeleteModule.NO_PERMISSION(response.statusText); },
    404: () => { throw ApiErrors.DeleteModule.MODULE_NOT_FOUND(response.statusText); }
  });
};

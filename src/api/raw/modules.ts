import { IModule, IModuleResponse, ModuleSorting } from '~types';

import { axios, BASE_URL, URLParams } from '../utils';
import { ApiErrors, validateStatusCode } from './ApiErrors';

const MODULES_URL = `${BASE_URL}/modules`;
const moduleIdUrl = (id: number | string): string => `${BASE_URL}/modules/${id}`;
const TAGS_URL = `${BASE_URL}/tags`;

export const getModules = async (
  limit?: number,
  offset?: number,
  owner?: number,
  trusted?: boolean,
  flagged?: boolean,
  tags?: string,
  q?: string,
  sort?: ModuleSorting,
): Promise<IModuleResponse> => {
  const response = await axios.get<IModuleResponse>(MODULES_URL, {
    params: {
      limit,
      offset,
      owner,
      trusted: trusted || undefined,
      flagged: flagged || undefined,
      tags,
      q,
      sort,
    },
  });

  return validateStatusCode(response);
};

export const createModule = async (
  name: string,
  description: string,
  tags: string[],
  image: string,
  flagged = false,
): Promise<IModule> => {
  const searchParams = new URLParams({
    name,
    description,
    flagged,
    image,
    tags,
  });

  const response = await axios.post<IModule>(MODULES_URL, searchParams.toString());

  return validateStatusCode(response);
};
export const getSingleModule = async (moduleName: string): Promise<IModule> => {
  const response = await axios.get<IModule>(moduleIdUrl(moduleName));

  return validateStatusCode(response, ApiErrors.GetModule);
};

export const updateModule = async (
  moduleId: number,
  description?: string,
  image?: string,
  flagged?: boolean,
  tags?: string[],
): Promise<IModule> => {
  const searchParams = new URLParams({ description, image, flagged, tags });

  const response = await axios.patch<IModule>(
    moduleIdUrl(moduleId),
    searchParams.toString(),
  );

  return validateStatusCode(response, ApiErrors.UpdateModule);
};

export const deleteModule = async (moduleId: number): Promise<undefined> => {
  const response = await axios.delete<undefined>(moduleIdUrl(moduleId));

  return validateStatusCode(response, ApiErrors.DeleteModule);
};

export const getTags = async (): Promise<string[]> => {
  const response = await axios.get<string[]>(TAGS_URL);

  return validateStatusCode(response);
};

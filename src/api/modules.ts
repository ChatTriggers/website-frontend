import qs from 'querystring';
import { axios, BASE_URL, IUser, Result, IResult, ApiErrors, throwErr } from '.';
import { modulesStore, authStore } from '~store';
import { AxiosResponse } from 'axios';

export interface IModule {
  id: number;
  name: string;
  owner: IUser;
  description: string;
  image: string;
  tags: string[];
  downloads: number;
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

export const getModules = async (): Promise<IModuleResponse> => {
  modulesStore.clearModules();
  let owner: number | undefined;

  if (modulesStore.onlyUserModules && authStore.isAuthed) {
    // tslint:disable-next-line:no-non-null-assertion
    owner = authStore.user!.id;
  }
  
  let response: AxiosResponse<IModuleResponse>;

  try {
    response = await axios.get(MODULES_URL, {
      params: {
        limit: modulesStore.modulesPerPage,
        offset: modulesStore.offset,
        owner,
        trusted: modulesStore.onlyTrusted || undefined,
        flagged: modulesStore.onlyFlagged || undefined,
        q: modulesStore.search === '' ? undefined : modulesStore.search
      }
    });

    modulesStore.clearError();
  } catch (e) {
    modulesStore.setError();
    throw e;
  }

  console.log('getModules:');
  console.log(response);

  switch (response.status) {
    case 200:
      const moduleResponse = response.data;

      modulesStore.setModules(moduleResponse.modules)
        .setMeta(moduleResponse.meta)
        .clearError();

      return moduleResponse;
    default:
      modulesStore.setError();

      return throwErr('getModules', response);
  }
};

export const createModule = async (
  name: string,
  description: string,
  image: string,
/*tags: string[],
  file: ??? */
): Promise<IModule> => {
  const response = await axios.post(MODULES_URL, qs.stringify({
    name,
    description,
    image
  }));

  console.log('createModule:');
  console.log(response);

  switch (response.status) {
    case 200:
      return response.data as IModule;
    default: 
      return throwErr('createModule', response);
  }
};

export const getModule = async (
  id: number
): Promise<IResult<IModule, ApiErrors.GetModule>> => {
  const response = await axios.get(MODULE_ID_URL(id), {
    params: { id }
  });

  console.log('getModule:');
  console.log(response);

  switch (response.status) {
    case 200: 
      return Result.Ok(response.data as IModule);
    case 400:
      return Result.Err(ApiErrors.MALFORMED_MODULE_ID);
    case 404: 
      return Result.Err(ApiErrors.MODULE_NOT_FOUND);
    default: 
      return throwErr('getModule', response);
  }
};

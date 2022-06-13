export interface IUser {
  id: number;
  name: string;
  rank: 'default' | 'trusted' | 'admin';
}

export interface IRelease {
  id: string;
  releaseVersion: string;
  modVersion: string;
  changelog: string;
  downloads: number;
  scripts: File | undefined;
  createdAt: number;
  verified: boolean;
}

export interface IModule {
  id: number;
  name: string;
  owner: IUser;
  description: string;
  image: string;
  tags: string[];
  downloads: number;
  releases: IRelease[];
  flagged?: boolean;
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

export interface IPersonalUser extends IUser {
  email: string;
}

export interface IRawVersions {
  [version: string]: Array<string>;
}

export interface IVersion {
  majorMinor: string;
  patches: Array<string>;
}

export type IVersions = Array<IVersion>;

export type ModuleSearchFilter = 'all' | 'trusted' | 'user' | 'flagged';
export type ModuleSorting =
  | 'DATE_CREATED_DESC'
  | 'DATE_CREATED_ASC'
  | 'DOWNLOADS_DESC'
  | 'DOWNLOADS_ASC';

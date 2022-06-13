import { action, computed, makeObservable, observable } from 'mobx';

import { IModuleMetadata, IVersions, ModuleSearchFilter, ModuleSorting } from '~types';

export const MODULES_PER_PAGE_OPTIONS = [10, 25, 50];

class ApiStore {
  constructor() {
    makeObservable(this, {
      meta: observable,
      modulesPerPage: observable,
      page: observable,
      search: observable,
      filter: observable,
      tags: observable,
      sorting: observable,
      allowedTags: observable,
      ctVersions: observable,
      totalPages: computed,
      offset: computed,
      latestVersion: computed,
      setTags: action,
      setMeta: action,
      setPage: action,
      setModulesPerPage: action,
      setSearch: action,
      setFilter: action,
      setAllowedTags: action,
      setSorting: action,
      setCtVersions: action,
    });
  }
  public meta: IModuleMetadata | undefined;

  public modulesPerPage = MODULES_PER_PAGE_OPTIONS[0];

  public page = 0;

  public search = '';

  public filter: ModuleSearchFilter = 'all';

  public tags: string[] = [];

  public sorting: ModuleSorting = 'DATE_CREATED_DESC';

  public allowedTags: string[] = [];

  public ctVersions: IVersions = [];

  get totalPages(): number {
    return this.meta ? Math.ceil(this.meta.total / this.modulesPerPage) : 0;
  }

  get offset(): number {
    return this.meta ? this.page * this.modulesPerPage : 0;
  }

  get latestVersion(): string {
    if (this.ctVersions.length === 0) {
      return '1.0.0';
    }
    const latest = this.ctVersions[0];
    return `${latest.majorMinor}.${latest.patches[0]}`;
  }

  public setTags = (tags: string[]): void => {
    this.tags = tags;
  };

  public setMeta = (meta: IModuleMetadata): void => {
    this.meta = meta;
  };

  public setPage = (page: number): void => {
    this.page = page;
  };

  public setModulesPerPage = (modulesPerPage: number): void => {
    this.modulesPerPage = modulesPerPage;
  };

  public setSearch = (search: string): void => {
    this.search = search;
  };

  public setFilter = (filter: ModuleSearchFilter): void => {
    this.filter = filter;
  };

  public setAllowedTags = (allowedTags: string[]): void => {
    this.allowedTags = allowedTags;
  };

  public setSorting = (sorting: ModuleSorting): void => {
    this.sorting = sorting;
  };

  public setCtVersions = (ctVersions: IVersions): void => {
    this.ctVersions = ctVersions;
  };
}

export default new ApiStore();

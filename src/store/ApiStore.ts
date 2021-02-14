import { observable, action, computed } from 'mobx';
import {
  ModuleSearchFilter, ModuleSorting, IModuleMetadata, IVersions,
} from '~types';

export const MODULES_PER_PAGE_OPTIONS = [10, 25, 50];

class ApiStore {
  @observable
  public meta: IModuleMetadata | undefined;

  @observable
  public modulesPerPage = MODULES_PER_PAGE_OPTIONS[0];

  @observable
  public page = 0;

  @observable
  public search = '';

  @observable
  public filter: ModuleSearchFilter = 'all';

  @observable
  public tags: string[] = [];

  @observable
  public sorting: ModuleSorting = 'DATE_CREATED_DESC';

  @observable
  public allowedTags: string[] = [];

  @observable
  public ctVersions: IVersions = [];

  @computed
  get totalPages(): number {
    return this.meta ? Math.ceil(this.meta.total / this.modulesPerPage) : 0;
  }

  @computed
  get offset(): number {
    return this.meta ? this.page * this.modulesPerPage : 0;
  }

  @computed
  get latestVersion(): string {
    if (this.ctVersions.length === 0) {
      return '1.0.0';
    }
    const latest = this.ctVersions[0];
    return `${latest.majorMinor}.${latest.patches[0]}`;
  }

  @action
  public setTags = (tags: string[]): void => {
    this.tags = tags;
  }

  @action
  public setMeta = (meta: IModuleMetadata): void => {
    this.meta = meta;
  }

  @action
  public setPage = (page: number): void => {
    this.page = page;
  }

  @action
  public setModulesPerPage = (modulesPerPage: number): void => {
    this.modulesPerPage = modulesPerPage;
  }

  @action
  public setSearch = (search: string): void => {
    this.search = search;
  }

  @action
  public setFilter = (filter: ModuleSearchFilter): void => {
    this.filter = filter;
  }

  @action
  public setAllowedTags = (allowedTags: string[]): void => {
    this.allowedTags = allowedTags;
  }

  @action
  public setSorting = (sorting: ModuleSorting): void => {
    this.sorting = sorting;
  }

  @action
  public setCtVersions = (ctVersions: IVersions): void => {
    this.ctVersions = ctVersions;
  }
}

export default new ApiStore();

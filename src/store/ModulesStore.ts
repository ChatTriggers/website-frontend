import { observable, computed, action } from 'mobx';
import { IModule, IModuleMetadata, ModuleSearchFilter } from '~types';

export const MODULES_PER_PAGE_OPTIONS = [10, 25, 50];

class ModulesStore {
  @observable
  public firstLoad = true;

  @observable
  public meta: IModuleMetadata | undefined;

  @observable
  public compact = false;

  @observable
  public modulesPerPage = MODULES_PER_PAGE_OPTIONS[0];

  @observable
  public page = 0;

  @observable
  public search: string | undefined;

  @observable
  public searchFilter: ModuleSearchFilter = 'all';

  @observable
  public modules: IModule[] = [];

  @observable
  public error = false;

  @observable
  public allowedTags: string[] = [];

  @computed
  get totalPages(): number {
    return this.meta ? Math.ceil(this.meta.total / this.modulesPerPage) : 0;
  }

  @computed
  get offset(): number {
    return this.meta ? this.page * this.modulesPerPage : 0;
  }

  @action
  public clearModules = (): this => {
    this.modules = [];

    return this;
  }

  @action
  public setError = (error = true): this => {
    this.error = error;

    return this;
  }

  @action
  public clearError = (): this => {
    this.error = false;

    return this;
  }

  @action
  public setModules = (modules: IModule[]): this => {
    this.modules = modules;

    return this;
  }

  @action
  public setMeta = (meta: IModuleMetadata): this => {
    this.meta = meta;

    return this;
  }

  @action
  public setPage = (page: number): this => {
    this.page = page;

    return this;
  }

  @action
  public setModulesPerPage = (modulesPerPage: number): this => {
    this.modulesPerPage = modulesPerPage;

    return this;
  }

  @action
  public setSearch = (search?: string): this => {
    this.search = search;

    return this;
  }

  @action
  public setSearchFilter = (filter: ModuleSearchFilter): this => {
    this.searchFilter = filter;

    return this;
  }

  @action
  public setAllowedTags = (tags: string[]): this => {
    this.allowedTags = tags;

    return this;
  }
}

export default new ModulesStore();

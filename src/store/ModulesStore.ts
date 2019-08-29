import { observable, computed, action } from 'mobx';
import { IModule, IModuleMetadata } from '~api';

export const MODULES_PER_PAGE_OPTIONS = [10, 25, 50];

class ModulesStore {
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
  public onlyFlagged = false;

  @observable
  public onlyTrusted = false;

  @observable
  public onlyUserModules = false;

  @observable
  public modules: IModule[] = [];

  @observable
  public error = false;

  @observable
  public allowedTags: string[] = [];

  @computed
  get totalPages() {
    return this.meta ? Math.ceil(this.meta.total / this.modulesPerPage) : 0;
  }

  @computed
  get offset() {
    return this.meta ? this.page * this.modulesPerPage : 0;
  }

  @action
  public clearModules = () => {
    this.modules = [];

    return this;
  }

  @action
  public setError = (error = true) => {
    this.error = error;

    return this;
  }

  @action
  public clearError = () => {
    this.error = false;

    return this;
  }

  @action
  public setModules = (modules: IModule[]) => {
    this.modules = modules;

    return this;
  }

  @action
  public setMeta = (meta: IModuleMetadata) => {
    this.meta = meta;

    return this;
  }

  @action
  public setPage = (page: number) => {
    this.page = page;

    return this;
  }

  @action
  public setModulesPerPage = (modulesPerPage: number) => {
    this.modulesPerPage = modulesPerPage;

    return this;
  }

  @action
  public setSearch = (search?: string) => {
    this.search = search;

    return this;
  }

  @action
  public setOnlyFlagged = (onlyFlagged = true) => {
    this.onlyFlagged = onlyFlagged;

    return this;
  }

  @action
  public setOnlyTrusted = (onlyTrusted = true) => {
    this.onlyTrusted = onlyTrusted;

    return this;
  }

  @action
  public setOnlyUserModules = (onlyUserModules = true) => {
    this.onlyUserModules = onlyUserModules;

    return this;
  }

  @action
  public setAllowedTags = (tags: string[]) => {
    this.allowedTags = tags;

    return this;
  }
}

export const modulesStore = new ModulesStore();

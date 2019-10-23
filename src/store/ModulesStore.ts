/* eslint-disable max-classes-per-file */
import { observable, computed, action } from 'mobx';
import {
  IModule, IModuleMetadata, ModuleSearchFilter, ModuleSorting,
} from '~types';

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
  public searchTags: string[] = [];

  @observable
  public modules: IModule[] = [];

  @observable
  public allowedTags: string[] = [];

  // I really don't want to have to do undefined checks on this object everywhere,
  // so I just make it a dummy module. It gets updated before use, so in practice,
  // it will never be undefined.
  @observable
  public activeModule: IModule = {
    id: -1,
    description: '',
    downloads: -1,
    image: '',
    name: '',
    owner: {
      id: -1,
      name: '',
      rank: 'default',
    },
    releases: [],
    tags: [],
  };

  @observable
  public moduleSorting: ModuleSorting = 'DATE_CREATED_DESC';

  @computed
  get totalPages(): number {
    return this.meta ? Math.ceil(this.meta.total / this.modulesPerPage) : 0;
  }

  @computed
  get offset(): number {
    return this.meta ? this.page * this.modulesPerPage : 0;
  }

  @action
  public setSearchTags = (tags: string[]): this => {
    this.searchTags = tags;

    return this;
  }

  @action
  public clearModules = (): this => {
    this.modules = [];

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

  @action
  public setModuleSorting = (sorting: ModuleSorting): this => {
    this.moduleSorting = sorting;

    return this;
  }
}

const modulesStore = new ModulesStore();
export default modulesStore;

/*

modulesStore.modules[...];

modulesStore.editModule(moduleId).setDescription('...').setTags(['...', '...']);

modulesStore.editModule(moduleId).editRelease(releaseId).doWhatever

*/

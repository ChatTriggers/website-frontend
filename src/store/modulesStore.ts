import { observable } from 'mobx';
import { IModule, IModuleMetadata } from '../api';

const MODULES_PER_PAGE_OPTIONS = [10, 25, 50];

interface IViewConfig {
  compact: boolean;
  modulesPerPage: number;
  page: number;
  offset: number;
  search: string | undefined;
  flagged: boolean;
  trusted: boolean;
  userModules: boolean;
}

const viewConfigDefaults: IViewConfig = {
  compact: true,
  modulesPerPage: MODULES_PER_PAGE_OPTIONS[0],
  page: 0,
  offset: 0,
  search: undefined,
  flagged: false,
  trusted: true,
  userModules: true
};

export class ModulesStore {
  public static MODULES_PER_PAGE_OPTIONS = MODULES_PER_PAGE_OPTIONS;

  @observable
  public meta: IModuleMetadata | undefined = undefined;

  @observable
  public modules: IModule[] = [];

  @observable
  public viewConfig: IViewConfig = viewConfigDefaults;
}

const modulesStore = new ModulesStore();

export { modulesStore };

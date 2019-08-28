import { store } from 'react-easy-state';
import { IModule, IModuleMetadata } from '~api';

export const MODULES_PER_PAGE_OPTIONS = [10, 25, 50];

interface IModuleStore {
  meta?: IModuleMetadata;
  viewConfig: {
    compact: boolean;
    modulesPerPage: number;
    page: number;
    search?: string;
    onlyFlagged: boolean;
    onlyTrusted: boolean;
    onlyUserModules: boolean;
  };
  modules: IModule[];
  error: boolean;
}

// tslint:disable-next-line:no-unnecessary-class
export class Modules {
  public static store = store<IModuleStore>({
    meta: undefined,
    viewConfig: {
      compact: false,
      modulesPerPage: MODULES_PER_PAGE_OPTIONS[0],
      page: 0,
      search: undefined,
      onlyFlagged: false,
      onlyTrusted: false,
      onlyUserModules: false
    },
    modules: [],
    error: false
  });

  static get totalPages() {
    if (Modules.store.meta) {
      return Math.ceil(Modules.store.meta.total / Modules.store.viewConfig.modulesPerPage);
    } else {
      return 0;
    }
  }

  static get offset() {
    if (Modules.store.meta) {
      return Modules.store.viewConfig.page * Modules.store.viewConfig.modulesPerPage;
    } else {
      return 0;
    }
  }
}

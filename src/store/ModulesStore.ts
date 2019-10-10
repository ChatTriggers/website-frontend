/* eslint-disable max-classes-per-file */
import { observable, computed, action } from 'mobx';
import clone from 'clone';
import {
  IModule, IModuleMetadata, ModuleSearchFilter, IRelease,
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

  @action
  public updateModule = (newModule: IModule): this => {
    const oldModuleIndex = this.modules.findIndex(m => m.id === newModule.id);
    if (!oldModuleIndex) return this;

    this.modules[oldModuleIndex] = newModule;
    return this;
  }

  /**
   * It's physically impossible to lift this out into a builder classes without
   * either using a class/field before it's defined, or creating dependency cycle.
   */
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  public editModule = (moduleId: number) => ({
    setDescription: action((description: string) => {
      this.modules = clone(this.modules).reduce((prev, curr) => {
        if (curr.id !== moduleId) prev.push(curr);
        else prev.push({ ...curr, description });

        return prev;
      }, [] as IModule[]);
    }),
    setImage: action((image: string) => {
      this.modules = clone(this.modules).reduce((prev, curr) => {
        if (curr.id !== moduleId) prev.push(curr);
        else prev.push({ ...curr, image });

        return prev;
      }, [] as IModule[]);
    }),
    setTags: action((tags: string[]) => {
      this.modules = clone(this.modules).reduce((prev, curr) => {
        if (curr.id !== moduleId) prev.push(curr);
        else prev.push({ ...curr, tags });

        return prev;
      }, [] as IModule[]);
    }),
    editRelease: (releaseId: string) => ({
      setModVersion: action((modVersion: string) => {
        this.modules = clone(this.modules).reduce((prev, curr) => {
          if (curr.id !== moduleId) {
            prev.push(curr);
          } else {
            prev.push({
              ...curr,
              releases: clone(curr.releases).reduce((prev2, curr2) => {
                if (curr2.id !== releaseId) prev2.push(curr2);
                else prev2.push({ ...curr2, modVersion });

                return prev2;
              }, [] as IRelease[]),
            });
          }

          return prev;
        }, [] as IModule[]);
      }),
      setChangelog: action((changelog: string) => {
        this.modules = clone(this.modules).reduce((prev, curr) => {
          if (curr.id !== moduleId) {
            prev.push(curr);
          } else {
            prev.push({
              ...curr,
              releases: clone(curr.releases).reduce((prev2, curr2) => {
                if (curr2.id !== releaseId) prev2.push(curr2);
                else prev2.push({ ...curr2, changelog });

                return prev2;
              }, [] as IRelease[]),
            });
          }

          return prev;
        }, [] as IModule[]);
      }),
    }),
  });
}

const modulesStore = new ModulesStore();
export default modulesStore;

/*

modulesStore.modules[...];

modulesStore.editModule(moduleId).setDescription('...').setTags(['...', '...']);

modulesStore.editModule(moduleId).editRelease(releaseId).doWhatever

*/

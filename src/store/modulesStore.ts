import { observable } from 'mobx';
import { IModule, IModuleMetadata } from '../api';

interface IViewConfig {
  compact: boolean;
  modulesPerPage: number;
}

const viewConfigDefaults: IViewConfig = {
  compact: true,
  modulesPerPage: 20
};

export class ModulesStore {
  @observable
  public meta: IModuleMetadata | undefined = undefined;

  @observable
  public modules: IModule[] = [];

  @observable
  public viewConfig: IViewConfig = viewConfigDefaults;
}

const modulesStore = new ModulesStore();

export { modulesStore };

/* eslint-disable max-classes-per-file */
import { observable, action } from 'mobx';
import { IModule } from '~types';

class ModulesStore {
  @observable
  public modules: IModule[] = [];

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

  @action
  public setModules = (modules: IModule[]): void => {
    this.modules = modules;
  }
}

export default new ModulesStore();

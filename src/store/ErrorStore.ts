import { observable } from 'mobx';

class ErrorStore {
  @observable
  modulesNotLoaded = false;
}

export default new ErrorStore();

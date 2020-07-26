import { observable, action } from 'mobx';

class ErrorStore {
  @observable
  modulesNotLoaded = false;

  @observable
  error = false;

  @observable
  errorTitle = '';

  @observable
  errorMessage = '';

  @action
  setError = (title: string, message: string): void => {
    this.error = true;
    this.errorTitle = title;
    this.errorMessage = message;
  }

  @action
  clearError = (): void => {
    this.error = false;
  }
}

export default new ErrorStore();

import { action, makeObservable, observable } from 'mobx';

class ErrorStore {
  constructor() {
    makeObservable(this, {
      modulesNotLoaded: observable,
      error: observable,
      errorTitle: observable,
      errorMessage: observable,
      setError: action,
      clearError: action,
    });
  }

  modulesNotLoaded = false;

  error = false;

  errorTitle = '';

  errorMessage = '';

  setError = (title: string, message: string): void => {
    this.error = true;
    this.errorTitle = title;
    this.errorMessage = message;
  };

  clearError = (): void => {
    this.error = false;
  };
}

export default new ErrorStore();

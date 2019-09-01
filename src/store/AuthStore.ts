import { observable, computed, action } from 'mobx';
import { IUser } from '~api';

interface IAuthStore {
  user: IUser | undefined;
}

// tslint:disable-next-line:no-unnecessary-class
class AuthStore {
  @observable
  public user: IUser | undefined;

  @computed
  get isAuthed() {
    return !!this.user;
  }
  
  @computed
  get isDefault() {
    return this.user && this.user.rank === 'default';
  }
  
  @computed
  get isTrusted() {
    return this.user && this.user.rank === 'trusted';
  }
  
  @computed
  get isAdmin() {
    return this.user && this.user.rank === 'admin';
  }

  @action
  public setUser = (user?: IUser) => {
    this.user = user;

    return this;
  }
}

export const authStore = new AuthStore();

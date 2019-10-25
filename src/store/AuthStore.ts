import { observable, computed, action } from 'mobx';
import { IUser } from '~types';

interface IAuthStore {
  user: IUser | undefined;
}

// tslint:disable-next-line:no-unnecessary-class
class AuthStore {
  @observable
  public user: IUser | undefined;

  @computed
  get isAuthed(): boolean {
    return !!this.user;
  }

  @computed
  get isDefault(): boolean {
    return (this.user && this.user.rank === 'default') || false;
  }

  @computed
  get isTrusted(): boolean {
    return (this.user && this.user.rank === 'trusted') || false;
  }

  @computed
  get isAdmin(): boolean {
    return (this.user && this.user.rank === 'admin') || false;
  }

  @computed
  get isTrustedOrHigher(): boolean {
    return this.isTrusted || this.isAdmin;
  }

  @action
  public setUser = (user?: IUser): this => {
    this.user = user;

    return this;
  }
}

export default new AuthStore();

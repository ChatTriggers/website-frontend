import { observable, computed } from 'mobx';
import { IUser } from '../api';

export class AuthStore {
  @observable
  public authedUser: IUser | undefined = undefined;

  @computed
  get userIsDefault() {
    return !this.authedUser || this.authedUser.rank === 'default';
  }

  @computed
  get userIsTrusted() {
    return !this.authedUser || this.authedUser.rank === 'trusted';
  }

  @computed
  get userIsAdmin() {
    return !this.authedUser || this.authedUser.rank === 'admin';
  }

  @computed
  get userIsAuthed() {
    return !!this.authedUser;
  }
}

export const authStore = new AuthStore();

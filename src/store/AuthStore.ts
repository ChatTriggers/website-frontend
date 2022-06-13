import { action, computed, makeObservable, observable } from 'mobx';

import { IUser } from '~types';

class AuthStore {
  constructor() {
    makeObservable(this, {
      user: observable,
      isAuthed: computed,
      isDefault: computed,
      isTrusted: computed,
      isAdmin: computed,
      isTrustedOrHigher: computed,
      setUser: action,
    });
  }
  public user: IUser | undefined;

  get isAuthed(): boolean {
    return !!this.user;
  }

  get isDefault(): boolean {
    return (this.user && this.user.rank === 'default') || false;
  }

  get isTrusted(): boolean {
    return (this.user && this.user.rank === 'trusted') || false;
  }

  get isAdmin(): boolean {
    return (this.user && this.user.rank === 'admin') || false;
  }

  get isTrustedOrHigher(): boolean {
    return this.isTrusted || this.isAdmin;
  }

  public setUser = (user?: IUser): this => {
    this.user = user;

    return this;
  };
}

export default new AuthStore();

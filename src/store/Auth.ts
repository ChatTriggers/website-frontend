import { store } from 'react-easy-state';
import { IUser } from '../api';

interface IAuthStore {
  user: IUser | undefined;
}

// tslint:disable-next-line:no-unnecessary-class
export class Auth {
  public static store = store<IAuthStore>({
    user: undefined
  });

  static get isAuthed() {
    return !!this.store.user;
  }

  static get isDefault() {
    return this.store.user && this.store.user.rank === 'default';
  }

  static get isTrusted() {
    return this.store.user && this.store.user.rank === 'trusted';
  }

  static get isAdmin() {
    return this.store.user && this.store.user.rank === 'admin';
  }
}

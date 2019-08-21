import { store } from 'react-easy-state';
import { IUser } from '../api';

interface IAuthStore {
  authedUser: IUser | undefined;
}

// tslint:disable-next-line:no-unnecessary-class
export class Auth {
  public static store = store<IAuthStore>({
    authedUser: undefined
  });

  static get isAuthed() {
    return !!this.store.authedUser;
  }

  static get isDefault() {
    return this.store.authedUser && this.store.authedUser.rank === 'default';
  }

  static get isTrusted() {
    return this.store.authedUser && this.store.authedUser.rank === 'trusted';
  }

  static get isAdmin() {
    return this.store.authedUser && this.store.authedUser.rank === 'admin';
  }
}

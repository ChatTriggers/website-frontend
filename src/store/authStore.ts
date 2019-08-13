import { observable } from 'mobx';
import { IUser } from '../api';

export class AuthStore {
  @observable
  public authedUser: IUser | undefined = undefined;
}

export const authStore = new AuthStore();

/**
 * For random things that don't fit in authStore or modulesStore
 */
import { observable, action } from 'mobx';

class GlobalStore {
  @observable
  public drawerTitle = '';

  @action
  public setDrawerTitle = (drawerTitle: string): void => {
    this.drawerTitle = drawerTitle;
  }
}

export default new GlobalStore();

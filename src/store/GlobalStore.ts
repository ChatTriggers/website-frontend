/**
 * For random things that don't fit in authStore or modulesStore
 */
import { action, makeObservable, observable } from 'mobx';

class GlobalStore {
  constructor() {
    makeObservable(this, {
      firstLoad: observable,
      drawerTitle: observable,
      setDrawerTitle: action,
    });
  }
  public firstLoad = true;

  public drawerTitle = '';

  public setDrawerTitle = (drawerTitle: string): void => {
    this.drawerTitle = drawerTitle;
  };
}

export default new GlobalStore();

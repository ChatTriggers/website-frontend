import { configure } from 'mobx';

configure({
  enforceActions: 'always',
});

export { default as modulesStore, MODULES_PER_PAGE_OPTIONS } from './ModulesStore';
export { default as authStore } from './AuthStore';
export { default as globalStore } from './GlobalStore';

export {
  observable, action, computed, runInAction,
} from 'mobx';
export { observer } from 'mobx-react';

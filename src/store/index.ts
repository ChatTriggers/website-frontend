import { configure } from 'mobx';

configure({
  enforceActions: 'always',
});

export { default as modulesStore } from './ModulesStore';
export { default as authStore } from './AuthStore';
export { default as globalStore } from './GlobalStore';
export { default as errorStore } from './ErrorStore';
export { default as apiStore, MODULES_PER_PAGE_OPTIONS } from './ApiStore';

export {
  observable, action, computed, runInAction,
} from 'mobx';
export { observer } from 'mobx-react';

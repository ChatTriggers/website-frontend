import { configure } from 'mobx';

if (process.env.NODE_ENV === 'development') {
  configure({
    enforceActions: 'always',
    computedRequiresReaction: true,
    reactionRequiresObservable: true,
    observableRequiresReaction: true,
    disableErrorBoundaries: true,
  });
}

export { default as apiStore, MODULES_PER_PAGE_OPTIONS } from './ApiStore';
export { default as authStore } from './AuthStore';
export { default as errorStore } from './ErrorStore';
export { default as globalStore } from './GlobalStore';
export { default as modulesStore } from './ModulesStore';
export { action, computed, observable, runInAction } from 'mobx';
export { observer } from 'mobx-react';

import { configure } from 'mobx';

configure({
  enforceActions: 'always',
});

export { default as modulesStore, MODULES_PER_PAGE_OPTIONS } from './ModulesStore';
export { default as authStore } from './AuthStore';

export { observable, action, computed } from 'mobx';
export { observer } from 'mobx-react';

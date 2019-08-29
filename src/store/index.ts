import { configure } from 'mobx';

configure({
  enforceActions: 'always'
});

export * from './ModulesStore';
export * from './AuthStore';

export { observable, action, computed } from 'mobx';
export { observer } from 'mobx-react';

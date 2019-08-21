import React from 'react';
import { view } from 'react-easy-state';
import Module from './Module';
import ModuleSkeleton from './ModuleSkeleton';
import ModuleController from '../ModuleController';
import { Modules } from '../../../store';

export default view(() => (
  <>
    <ModuleController />
    {Modules.store.modules.length > 0
      ? Modules.store.modules.map(module => <Module key={module.id} {...module} />)
      : Array.from(new Array(3)).map((_, index) => <ModuleSkeleton key={index} />)}
  </>
));

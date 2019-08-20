import React from 'react';
import { inject, observer } from 'mobx-react';
import Module from './Module';
import ModuleSkeleton from './ModuleSkeleton';
import ModuleController from '../ModuleController';
import { ModulesStore } from '../../../store';

interface IInjectedProps {
  modulesStore: ModulesStore;
}

@inject('modulesStore')
@observer
export default class extends React.Component {
  get injected() {
    return this.props as IInjectedProps;
  }

  public render() {
    const modules = this.injected.modulesStore.modules;

    return (
      <>
        <ModuleController />
        {modules.length > 0 
          ? modules.map(module => <Module key={module.id} {...module} />) 
          : Array.from(new Array(3)).map((_, index) => <ModuleSkeleton key={index} />)}
      </>
    );
  }
}

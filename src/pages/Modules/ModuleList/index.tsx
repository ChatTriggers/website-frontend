import React from 'react';
import { inject, observer } from 'mobx-react';
import Module from './Module';
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
    console.log(modules);

    return (
      <>
        {modules.map(module => <Module key={module.id} {...module} />)}
      </>
    );
  }
}

import React from 'react';
import ModuleList from './ModuleList';
import { ModulesStore } from '../../store';
import { getModules } from '../../api';
import { inject } from 'mobx-react';

interface IInjectedProps {
  modulesStore: ModulesStore;
}

@inject('modulesStore')
export default class extends React.Component {
  get injected() {
    return this.props as IInjectedProps;
  }

  public componentDidMount = async () => {
    const moduleResponse = await getModules();
    this.injected.modulesStore.modules = moduleResponse.modules;
    this.injected.modulesStore.meta = moduleResponse.meta;
  }

  public render() {
    return (
      <ModuleList />
    );
  }
}

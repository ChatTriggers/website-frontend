import React from 'react';
import { action } from 'mobx';
import { inject, observer } from 'mobx-react';
import ModuleList from './ModuleList';
import { ModulesStore, AuthStore } from '../../store';
import { getModules, getCurrentUser } from '../../api';

interface IInjectedProps {
  modulesStore: ModulesStore;
  authStore: AuthStore;
}

@inject('modulesStore', 'authStore')
@observer
export default class extends React.Component {
  get injected() {
    return this.props as IInjectedProps;
  }

  @action
  public componentDidMount = async () => {
    const moduleResponse = await getModules();
    this.injected.modulesStore.modules = moduleResponse.modules;
    this.injected.modulesStore.meta = moduleResponse.meta;

    const currentUserResponse = await getCurrentUser();

    if (currentUserResponse.ok) {
      this.injected.authStore.authedUser = currentUserResponse.value;
    }
  }

  public render() {
    return (
      <ModuleList />
    );
  }
}

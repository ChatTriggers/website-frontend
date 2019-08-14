import React from 'react';
import ModuleList from './ModuleList';
import { ModulesStore, AuthStore } from '../../store';
import { getModules, getCurrentUser } from '../../api';
import { inject, observer } from 'mobx-react';

interface IInjectedProps {
  modulesStore: ModulesStore;
  authStore: AuthStore;
}

@inject('modulesStore')
@inject('authStore')
@observer
export default class extends React.Component {
  get injected() {
    return this.props as IInjectedProps;
  }

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
      <>
        {this.injected.modulesStore.modules.length > 0 ? <ModuleList /> : (
          <div style={{ height: '100vh', backgroundColor: '#303030' }}>
            {/* gotta love a nice hard-coded css fix every once in a while */}
          </div>
        )}
      </>
    );
  }
}

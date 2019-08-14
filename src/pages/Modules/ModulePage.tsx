import React from 'react';
import ModuleList from './ModuleList';
import { ModulesStore } from '../../store';
import { getModules } from '../../api';
import { inject, observer } from 'mobx-react';

interface IInjectedProps {
  modulesStore: ModulesStore;
}

@inject('modulesStore')
@observer
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

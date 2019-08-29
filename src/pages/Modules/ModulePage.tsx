import React from 'react';
import ModuleList from '~modules/ModuleList';
import { observer } from '~store';
import { getModules, getCurrentAccount } from '~api';

@observer
export default class extends React.Component {
  public componentDidMount = async () => {
    await getModules();
    await getCurrentAccount();
  }

  public render() {
    return (
      <ModuleList />
    );
  }
}

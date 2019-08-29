import React from 'react';
import ModuleList from '~modules/ModuleList';
import { modulesStore, authStore, observer } from '~store';
import { getModules, getCurrentUser } from '~api';

@observer
export default class extends React.Component {
  public componentDidMount = async () => {
    const moduleResponse = await getModules();
    modulesStore.setModules(moduleResponse.modules);

    const currentUserResponse = await getCurrentUser();

    if (currentUserResponse.ok) {
      authStore.setUser(currentUserResponse.value);
    }
  }

  public render() {
    return (
      <ModuleList />
    );
  }
}

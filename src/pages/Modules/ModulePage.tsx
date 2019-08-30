import React from 'react';
import {
  Container
} from '@material-ui/core';
import ModuleList from '~modules/ModuleList';
import { observer } from '~store';
import { getModules, getCurrentAccount, loadTags } from '~api';

@observer
export default class extends React.Component {
  public componentDidMount = async () => {
    await getModules();
    await getCurrentAccount();
    await loadTags();
  }

  public render() {
    return (
      <Container>
        <ModuleList />
      </Container>
    );
  }
}

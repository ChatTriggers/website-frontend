import React from 'react';
import { Theme } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { getModules, getCurrentAccount, loadTags } from '~api';
import { modulesStore, observer } from '~store';
import { Drawer, StyledComponent, Styles } from '~components';
import ModuleList from '~components/ModuleList';

const styles = () => ({
  noModules: {
    width: '100vw',
    height: '100vh'
  },
  modules: {
    width: '100vw'
  }
});

@observer
class ModulesPage extends StyledComponent<typeof styles> {
  public componentWillMount = async () => {
    if (modulesStore.modules.length === 0) {
      getModules();
      getCurrentAccount();
      loadTags();
    }
  }

  public render() {
    return (
      <Drawer title="Modules">
        {modulesStore.modules.length > 0 ? (
          <div className={this.classes.modules}>
            <ModuleList />
          </div>
        ) : (
            <div className={this.classes.noModules} />
          )}
      </Drawer>
    );
  }
}

export default withStyles(styles)(ModulesPage);

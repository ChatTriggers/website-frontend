import React from 'react';
import { Theme, Box } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import Drawer from '~src/pages/ModulesPage/Drawer';
import ModuleList from '~src/pages/ModulesPage/ModuleList';
import { getModules, getCurrentAccount, loadTags } from '~api';
import { StyledComponent } from '~components';

const styles = (theme: Theme) => ({
  root: {
    display: 'flex',
    minHeight: '100vh'
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    backgroundColor: theme.palette.background.default
  }
});

class ModulePage extends StyledComponent<typeof styles> {
  public componentDidMount = async () => {
    await getModules();
    await getCurrentAccount();
    await loadTags();
  }

  public render() {
    return (
      <div className={this.classes.root}>
        <Drawer />
        <Box className={this.classes.content}>
          <ModuleList />
        </Box>
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(ModulePage);

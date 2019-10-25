import React from 'react';
import {
  Paper,
  Theme,
  withStyles,
} from '@material-ui/core';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import {
  observer,
  observable,
  action,
  modulesStore,
  runInAction,
} from '~store';
import { getModules } from '~api/raw';
import { StyledComponent, Styles } from '~components';
import ModuleError from '~components/Module/ModuleError';
import Tags from './Tags';
import ModulePageHeader from './Header';
import ModulePageReleases from './Releases';
import Description from './Description';

type ModuleProps = RouteComponentProps<{ module: string }>

const styles: Styles = (theme: Theme) => ({
  root: {
    [theme.breakpoints.only('xs')]: {
      width: '100vw',
      margin: 0,
      padding: 0,
    },
    [theme.breakpoints.up('sm')]: {
      width: '100%',
    },
    [theme.breakpoints.up('lg')]: {
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'column',
    },
    minHeight: 'calc(100vh - 64px)',
  },
  paperContainer: {
    margin: 'auto',
    width: '100%',
    maxWidth: 320,
  },
  paper: {
    padding: theme.spacing(2, 2, 1, 2),
    [theme.breakpoints.only('xs')]: {
      margin: theme.spacing(2),
    },
    [theme.breakpoints.between('sm', 'md')]: {
      margin: theme.spacing(3),
    },
    [theme.breakpoints.up('lg')]: {
      margin: theme.spacing(2, 4),
      padding: theme.spacing(3, 3, 2, 3),
      width: '100%',
      maxWidth: `calc(1000px - ${theme.spacing(1) * 2}px)`,
    },
  },
  titleChip: {
    display: 'flex',
  },
  versionChip: {
    marginRight: theme.spacing(1),
  },
  backButton: {
    marginRight: theme.spacing(2),
  },
  tagSelect: {
    width: '100%',
  },
});

@observer
class ModulePage extends StyledComponent<typeof styles, ModuleProps> {
  @observable
  private editedFields = {
    description: false,
    tags: false,
    releases: [] as string[],
  }

  @observable
  private error = false;

  @action
  public async componentDidMount(): Promise<void> {
    const moduleName = this.props.match.params.module;

    // Attempt to first find module in the modulesStore
    let temp = modulesStore.modules.find(m => m.name.toString().toLowerCase() === moduleName.toLowerCase());

    if (temp) modulesStore.activeModule = { ...temp };

    if (modulesStore.activeModule.id === -1) {
      // If the module isn't already loaded in the store, get it from the backend
      const response = await getModules(1, 0, undefined, undefined, undefined, undefined, moduleName);

      if (response.modules.length !== 1) {
        runInAction(() => {
          this.error = true;
        });
        return;
      }

      runInAction(() => {
        [temp] = response.modules;

        // not possible
        if (!temp) return;

        modulesStore.activeModule = { ...temp };
      });
    }
  }

  public render(): JSX.Element {
    if (this.error) {
      return (
        <div className={this.classes.root}>
          <ModuleError errorType="module-doesnt-exist" />
        </div>
      );
    }

    return (modulesStore.activeModule && (
      <div className={this.classes.root}>
        <Paper className={this.classes.paper}>
          {modulesStore.activeModule && (
            <ModulePageHeader />
          )}
        </Paper>
        <Description />
        <Tags />
        <Paper className={this.classes.paper}>
          <ModulePageReleases />
        </Paper>
      </div>
    )) || <div />;
  }
}

export default withStyles(styles)(withRouter(ModulePage));

import React from 'react';
import {
  Paper,
  Theme,
  withStyles,
} from '@material-ui/core';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import MetaTags from 'react-meta-tags';
import {
  observer,
  observable,
  action,
  modulesStore,
  runInAction,
} from '~store';
import { getSingleModule } from '~api/raw';
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
  private error = false;

  @action
  public async componentDidMount(): Promise<void> {
    const moduleName = this.props.match.params.module;

    // Attempt to first find module in the modulesStore
    const temp = modulesStore.modules.find(m => m.name.toString().toLowerCase() === moduleName.toLowerCase());

    if (temp) modulesStore.activeModule = { ...temp };

    if (modulesStore.activeModule.name !== moduleName) {
      // If the module isn't already loaded in the store, get it from the backend
      try {
        const response = await getSingleModule(moduleName);

        runInAction(() => {
          modulesStore.activeModule = { ...response };
        });
      } catch (e) {
        runInAction(() => {
          this.error = true;
        });
      }
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

    const module = modulesStore.activeModule;

    return (module && (
      <div className={this.classes.root}>
        <MetaTags>
          <title>{module.name}</title>
          <meta property="og:title" content={module.name} />
          <meta property="og:description" content={module.description} />
          {module.image !== '' && <meta property="og:image" content={module.image} />}
          <meta property="og:url" content={`https://www.chattriggers.com/modules/v/${module.name}`} />

        </MetaTags>
        <Paper className={this.classes.paper}>
          {module && <ModulePageHeader />}
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

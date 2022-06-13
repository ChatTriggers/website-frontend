import { Paper, Theme, withStyles } from '@material-ui/core';
import { WithStyles } from '@material-ui/styles/withStyles';
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { RouteComponentProps, withRouter } from 'react-router-dom';

import { getSingleModule } from '~api/raw';
import { Styles } from '~components';
import ModuleError from '~components/Module/ModuleError';
import { action, modulesStore, observer, runInAction } from '~store';

import Description from './Description';
import ModulePageHeader from './Header';
import ModulePageReleases from './Releases';
import Tags from './Tags';

type ModuleProps = RouteComponentProps<{ module: string }>;

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

const ModulePage = observer((props: ModuleProps & WithStyles<typeof styles>) => {
  const [error, setError] = React.useState(false);

  useEffect(
    action(() => {
      (async () => {
        const moduleName = props.match.params.module;

        // Attempt to first find module in the modulesStore
        const temp = modulesStore.modules.find(
          m => m.name.toString().toLowerCase() === moduleName.toLowerCase(),
        );

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
              setError(true);
            });
          }
        }
      })();
    }),
    [],
  );

  if (error) {
    return (
      <div className={props.classes.root}>
        <ModuleError errorType="module-doesnt-exist" />
      </div>
    );
  }

  const module = modulesStore.activeModule;

  return (
    (module && (
      <div className={props.classes.root}>
        <Helmet>
          <title>{module.name}</title>
          <meta property="og:title" content={module.name} />
          <meta property="og:description" content={module.description} />
          {module.image !== '' && <meta property="og:image" content={module.image} />}
          <meta
            property="og:url"
            content={`https://www.chattriggers.com/modules/v/${module.name}`}
          />
        </Helmet>
        <Paper className={props.classes.paper} square>
          {module && <ModulePageHeader />}
        </Paper>
        <Description />
        <Tags />
        <Paper className={props.classes.paper} square>
          <ModulePageReleases />
        </Paper>
      </div>
    )) || <div />
  );
});

export default withStyles(styles)(withRouter(ModulePage));

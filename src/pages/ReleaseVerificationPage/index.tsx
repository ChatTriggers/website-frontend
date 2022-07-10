import { Button, colors, Paper, Theme, Typography, withStyles } from '@material-ui/core';
import { WithStyles } from '@material-ui/styles/withStyles';
import { Buffer } from 'buffer';
import { isBinary } from 'istextorbinary';
import JSZip from 'jszip';
import React, { useEffect } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';

import { Styles } from '~components';
import { action, authStore } from '~store';

import {
  deleteRelease,
  getRelease,
  getReleaseScript,
  getSingleModule,
  verifyRelease,
} from '../../api/raw';
import DiffViewer, { IDiff } from './DiffViewer';

type VerificationProps = RouteComponentProps<{ module: string }>;

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
      marginTop: theme.spacing(4),
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
  headerButtons: {
    display: 'flex',
    alignItems: 'center',
    alignContent: 'center',
    justifyItems: 'center',
    justifyContent: 'center',
  },
  changelog: {
    marginBottom: theme.spacing(2),
  },
  moduleButton: {
    backgroundColor: colors.grey[300],
  },
  verifyButton: {
    marginLeft: theme.spacing(3),
    backgroundColor: colors.green[300],
  },
  deleteButton: {
    marginLeft: theme.spacing(3),
    backgroundColor: colors.red[300],
  },
});

const ReleaseVerificationPage = (
  props: VerificationProps & WithStyles<typeof styles>,
) => {
  const [isLoading, setLoading] = React.useState(true);
  const [token, setToken] = React.useState('');
  const [moduleId, setModuleId] = React.useState('');
  const [releaseId, setReleaseId] = React.useState('');
  const [changelog, setChangelog] = React.useState('');
  const [diffs, setDiffs] = React.useState<Array<IDiff> | undefined>();

  const loadBlobs = action(
    async (oldReleaseId: string | undefined, newReleaseId: string): Promise<void> => {
      if (!authStore.isTrustedOrHigher) {
        setLoading(false);
        return Promise.resolve();
      }

      const module = await getSingleModule(props.match.params.module);
      const moduleIdStr = module.id.toString();
      setModuleId(moduleIdStr);

      const release = await getRelease(moduleIdStr, newReleaseId);
      setChangelog(release.changelog);

      const oldBlob =
        oldReleaseId === undefined
          ? undefined
          : await getReleaseScript(moduleIdStr, oldReleaseId);
      const newBlob = await getReleaseScript(moduleIdStr, newReleaseId);

      const promises: Array<Promise<IDiff | undefined>> = [];

      if (oldBlob !== undefined) {
        (await JSZip.loadAsync(oldBlob)).forEach((path, file) => {
          if (file.dir || path.endsWith('.DS_STORE') || path.indexOf('.git/') !== -1)
            return;

          promises.push(
            new Promise(resolve => {
              file.async('string').then(text => {
                const arr = new TextEncoder().encode(
                  text.replace('\r\n', '\n').replace('\r', '\n'),
                );
                resolve({
                  path,
                  isBinary: isBinary(path, Buffer.from(arr)) === true,
                  oldText: text,
                  newText: undefined,
                });
              });
            }),
          );
        });
      }

      (await JSZip.loadAsync(newBlob)).forEach((path, file) => {
        if (file.dir || path.endsWith('.DS_STORE') || path.indexOf('.git/') !== -1)
          return;

        promises.push(
          new Promise(resolve => {
            file.async('string').then(text => {
              const arr = new TextEncoder().encode(
                text.replace('\r\n', '\n').replace('\r', '\n'),
              );
              resolve({
                path,
                isBinary: isBinary(path, Buffer.from(arr)) === true,
                oldText: undefined,
                newText: text,
              });
            });
          }),
        );
      });

      return Promise.all(promises).then(result => {
        const tempDiffs: Map<string, IDiff> = new Map();

        (result.filter(it => it !== undefined) as Array<IDiff>).forEach(diff => {
          if (tempDiffs.has(diff.path)) {
            const entry = tempDiffs.get(diff.path)!;
            if (diff.oldText !== undefined) {
              entry.oldText = diff.oldText;
            }
            if (diff.newText !== undefined) {
              entry.newText = diff.newText;
            }
          } else {
            tempDiffs.set(diff.path, diff);
          }
        });

        setDiffs(
          Array.from(tempDiffs.entries())
            .sort((a, b) => a[0].localeCompare(b[0]))
            .filter(a => a[1].oldText !== a[1].newText)
            .map(a => a[1]),
        );

        setLoading(false);
      });
    },
  );

  useEffect(
    action(() => {
      const params = new URLSearchParams(props.location.search);

      if (!params.has('token') || !params.has('newReleaseId')) {
        setLoading(false);
        return;
      }

      setToken(params.get('token')!);

      const newReleaseId = params.get('newReleaseId')!;

      setReleaseId(newReleaseId);

      let oldReleaseId: string | undefined;
      if (params.has('oldReleaseId')) {
        oldReleaseId = params.get('oldReleaseId')!;
      }

      setTimeout(() => loadBlobs(oldReleaseId, newReleaseId), 1000);
    }),
    [],
  );

  const viewModule = (): void => {
    const { history } = props;
    const { module } = props.match.params;
    history.push(`/modules/v/${module}`);
  };

  const verify = (): void => {
    verifyRelease(moduleId, releaseId, token).then(() => {
      props.history.push(`/modules/${props.match.params.module}`);
    });
  };

  const deleteSelectedRelease = (): void => {
    deleteRelease(parseInt(moduleId, 10), releaseId).then(() => {
      props.history.push(`/modules/${props.match.params.module}`);
    });
  };

  if (isLoading) {
    return (
      <div className={props.classes.root}>
        <Paper className={props.classes.paper} square>
          <Typography>Loading...</Typography>
        </Paper>
      </div>
    );
  }

  if (!authStore.isTrustedOrHigher) {
    return (
      <div className={props.classes.root}>
        <Paper className={props.classes.paper} square>
          <Typography>
            No permission! Please log in to a trusted/admin account to view this page
          </Typography>
        </Paper>
      </div>
    );
  }

  if (diffs === undefined) {
    throw new Error('unexpected');
  }

  return (
    <div className={props.classes.root}>
      <Paper className={props.classes.paper}>
        <Typography variant="h4">Changelog:</Typography>
        <Typography className={props.classes.changelog} variant="h6">
          {changelog}
        </Typography>
        <div className={props.classes.headerButtons}>
          <Button
            className={props.classes.moduleButton}
            variant="contained"
            onClick={viewModule}
          >
            <Typography>View Module</Typography>
          </Button>
          <Button
            className={props.classes.verifyButton}
            variant="contained"
            onClick={verify}
          >
            <Typography>Verify Release</Typography>
          </Button>
          <Button
            className={props.classes.deleteButton}
            variant="contained"
            onClick={deleteSelectedRelease}
          >
            <Typography>Delete Release</Typography>
          </Button>
        </div>
      </Paper>
      {diffs.map(diff => (
        <DiffViewer key={diff.path} diff={diff} />
      ))}
    </div>
  );
};

export default withStyles(styles)(withRouter(ReleaseVerificationPage));

import React from 'react';
import {
  Paper,
  Theme,
  Typography,
  Button,
  colors,
  withStyles,
} from '@material-ui/core';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import JSZip from 'jszip';
import { isBinary } from 'istextorbinary';
import { Buffer } from 'buffer';
import {
  observer,
  observable,
  action,
  authStore,
  runInAction,
} from '~store';
import {
  getReleaseScript,
  getRelease,
  verifyRelease,
  deleteRelease,
  getSingleModule,
} from '~api/raw';
import { StyledComponent, Styles } from '~components';
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

// MODULE ID: 154
// OLD RELEASE ID: af951edd-8d9a-486d-a4ae-3b8bb4e9a111
// NEW RELEASE ID: c1e2c90e-ea72-407c-9c1a-b29c393c8e4b
// http://localhost:7000/api/modules/154/releases/c1e2c90e-ea72-407c-9c1a-b29c393c8e4b?file=scripts
// http://localhost:3000/verify?token=47842236-b718-411c-9eb4-38cd93922765&moduleId=154&oldReleas
// eId=af951edd-8d9a-486d-a4ae-3b8bb4e9a111&newReleaseId=c1e2c90e-ea72-407c-9c1a-b29c393c8e4b

@observer
class ReleaseVerificationPage extends StyledComponent<typeof styles, VerificationProps> {
  @observable
  private isLoading = true;

  @observable
  private token = '';

  @observable
  private moduleId = '';

  @observable
  private releaseId = '';

  @observable
  private changelog = '';

  @observable
  private diffs: Array<IDiff> | undefined;

  public constructor(props: VerificationProps) {
    super(props);

    this.loadBlobs = this.loadBlobs.bind(this);
    this.viewModule = this.viewModule.bind(this);
    this.verify = this.verify.bind(this);
    this.delete = this.delete.bind(this);
  }

  @action
  public componentDidMount(): void {
    const params = new URLSearchParams(this.props.location.search);

    if (!params.has('token') || !params.has('newReleaseId')) {
      this.isLoading = false;
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.token = params.get('token')!;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const newReleaseId = params.get('newReleaseId')!;

    this.releaseId = newReleaseId;

    let oldReleaseId: string | undefined;
    if (params.has('oldReleaseId')) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      oldReleaseId = params.get('oldReleaseId')!;
    }

    setTimeout(() => this.loadBlobs(oldReleaseId, newReleaseId), 1000);
  }

  private async loadBlobs(oldReleaseId: string | undefined, newReleaseId: string): Promise<void> {
    if (!authStore.isTrustedOrHigher) {
      runInAction(() => {
        this.isLoading = false;
      });
      return Promise.resolve();
    }

    const module = await getSingleModule(this.props.match.params.module);
    runInAction(() => {
      this.moduleId = module.id.toString();
    });

    const release = await getRelease(this.moduleId, newReleaseId);
    runInAction(() => {
      this.changelog = release.changelog;
    });

    const oldBlob = oldReleaseId === undefined ? undefined : await getReleaseScript(this.moduleId, oldReleaseId);
    const newBlob = await getReleaseScript(this.moduleId, newReleaseId);

    const promises: Array<Promise<IDiff | undefined>> = [];

    if (oldBlob !== undefined) {
      (await JSZip.loadAsync(oldBlob)).forEach((path, file) => {
        if (file.dir || path.endsWith('.DS_STORE')) return;

        promises.push(new Promise(resolve => {
          file.async('string').then(text => {
            const arr = new TextEncoder().encode(text);
            resolve({
              path,
              isBinary: isBinary(path, Buffer.from(arr)) === true,
              oldText: text,
              newText: undefined,
            });
          });
        }));
      });
    }

    (await JSZip.loadAsync(newBlob)).forEach(async (path, file) => {
      if (file.dir || path.endsWith('.DS_STORE')) return;

      promises.push(new Promise(resolve => {
        file.async('string').then(text => {
          const arr = new TextEncoder().encode(text);
          resolve({
            path,
            isBinary: isBinary(path, Buffer.from(arr)) === true,
            oldText: undefined,
            newText: text,
          });
        });
      }));
    });

    return Promise.all(promises).then(result => {
      const diffs: Map<string, IDiff> = new Map();

      (result.filter(it => it !== undefined) as Array<IDiff>).forEach(diff => {
        if (diffs.has(diff.path)) {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          const entry = diffs.get(diff.path)!;
          if (diff.oldText !== undefined) {
            entry.oldText = diff.oldText;
          }
          if (diff.newText !== undefined) {
            entry.newText = diff.newText;
          }
        } else {
          diffs.set(diff.path, diff);
        }
      });

      runInAction(() => {
        this.diffs = Array.from(diffs.entries())
          .sort((a, b) => a[0].localeCompare(b[0]))
          .filter(a => a[1].oldText !== a[1].newText)
          .map(a => a[1]);

        this.isLoading = false;
      });
    });
  }

  private viewModule(): void {
    const { history } = this.props;
    const { module } = this.props.match.params;
    history.push(`/modules/v/${module}`);
  }

  private verify(): void {
    verifyRelease(this.moduleId, this.releaseId, this.token).then(() => {
      this.props.history.push(`/modules/${this.props.match.params.module}`);
    });
  }

  private delete(): void {
    deleteRelease(parseInt(this.moduleId, 10), this.releaseId).then(() => {
      this.props.history.push(`/modules/${this.props.match.params.module}`);
    });
  }

  public render(): JSX.Element {
    if (this.isLoading) {
      return (
        <div className={this.classes.root}>
          <Paper className={this.classes.paper} square>
            <Typography>
              Loading...
            </Typography>
          </Paper>
        </div>
      );
    }

    if (!authStore.isTrustedOrHigher) {
      return (
        <div className={this.classes.root}>
          <Paper className={this.classes.paper} square>
            <Typography>
              No permission! Please log in to a trusted/admin account to view this page
            </Typography>
          </Paper>
        </div>
      );
    }

    if (this.diffs === undefined) {
      throw new Error('unexpected');
    }

    return (
      <div className={this.classes.root}>
        <Paper className={this.classes.paper}>
          <Typography variant="h4">
            Changelog:
          </Typography>
          <Typography className={this.classes.changelog} variant="h6">
            {this.changelog}
          </Typography>
          <div className={this.classes.headerButtons}>
            <Button className={this.classes.moduleButton} variant="contained" onClick={this.viewModule}>
              <Typography>View Module</Typography>
            </Button>
            <Button className={this.classes.verifyButton} variant="contained" onClick={this.verify}>
              <Typography>Verify Release</Typography>
            </Button>
            <Button className={this.classes.deleteButton} variant="contained" onClick={this.delete}>
              <Typography>Delete Release</Typography>
            </Button>
          </div>
        </Paper>
        {this.diffs.map(diff => (
          <DiffViewer key={diff.path} diff={diff} />
        ))}
      </div>
    );
  }
}

export default withStyles(styles)(withRouter(ReleaseVerificationPage));

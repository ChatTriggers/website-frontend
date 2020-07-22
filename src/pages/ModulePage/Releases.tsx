import React from 'react';
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Collapse,
  Divider,
  Chip,
  Button,
  colors,
  Theme,
} from '@material-ui/core';
import {
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Clear as ClearIcon,
  Check as CheckIcon,
} from '@material-ui/icons';
import { makeStyles } from '@material-ui/styles';
import { Desktop } from '~components/utils/DeviceUtils';
import MarkdownEditor from '~components/MarkdownEditor';
import MarkdownRenderer from '~components/MarkdownRenderer';
import DeleteReleaseDialog from '~components/Desktop/DeleteReleaseDialog';
import CreateReleaseDialog from '~components/Desktop/CreateReleaseDialog';
import VersionSelect from '~components/Desktop/VersionSelect';
import { BASE_URL, getModules } from '~api';
import {
  action, modulesStore, authStore, runInAction, observer,
} from '~store';
import SemvarSorter from '~components/utils/SemvarSorter';
import { IRelease } from '~types';
import { updateRelease } from '~api/raw';

export type OpenDialog = 'add' | 'delete' | 'none';

const useStyles = makeStyles((theme: Theme) => ({
  title: {
    [theme.breakpoints.up('lg')]: {
      display: 'flex',
      justifyContent: 'space-between',
    },
  },
  releaseTitle: {
    display: 'flex',
    alignItems: 'center',
  },
  releaseBody: {
    padding: theme.spacing(0, 4),
  },
  releasesDownloadButton: {
    marginRight: theme.spacing(2),
  },
  releaseTypography: {
    padding: theme.spacing(0, 1),
  },
  descDivider: {
    margin: theme.spacing(0, 4, 1, 4),
  },
  editButton: {
    backgroundColor: colors.green[300],
    opacity: 0.8,
    margin: theme.spacing(0, 1),
  },
  deleteButton: {
    backgroundColor: colors.red[300],
    opacity: 0.8,
    margin: theme.spacing(0, 2, 0, 0),
  },
}));

export default observer((): JSX.Element => {
  const classes = useStyles();
  const authed = authStore.isTrustedOrHigher || (authStore.user && authStore.user.id === modulesStore.activeModule.owner.id);

  const [editingRelease, setEditingRelease] = React.useState('');
  const [version, setVersion] = React.useState('');
  const [changelog, setChangelog] = React.useState('');
  const [deletingRelease, setDeletingRelease] = React.useState('');
  const [openedRelease, _setOpenedRelease] = React.useState('');
  const [creatingRelease, setCreatingRelease] = React.useState(false);

  const closeDeleteDialog = (): void => {
    setDeletingRelease('');
  };

  const openCreatingDialog = (): void => {
    setCreatingRelease(true);
  };

  const closeCreatingDialog = (): void => {
    setCreatingRelease(false);
  };

  const setOpenedRelease = (releaseId: string): void => {
    _setOpenedRelease(openedRelease === releaseId ? '' : releaseId);
  };

  const onDownloadScripts = (releaseId: string): (() => void) => action((): void => {
    window.open(`${BASE_URL}/modules/${modulesStore.activeModule.id}/releases/${releaseId}?file=scripts`, 'scripts.zip');
  });

  const onCopyCommand = (): void => {
    navigator.clipboard.writeText(`/ct import ${modulesStore.activeModule.name}`);
  };

  return (
    <>
      <DeleteReleaseDialog
        open={deletingRelease.length > 0}
        onClose={closeDeleteDialog}
        releaseId={deletingRelease}
      />
      <CreateReleaseDialog
        open={creatingRelease}
        onClose={closeCreatingDialog}
      />
      <div className={classes.title}>
        <Typography variant="subtitle1">
          Releases
        </Typography>
        <Desktop>
          {authed ? (
            <Button variant="contained" color="primary" onClick={openCreatingDialog}>
              Create Release
            </Button>
          ) : <div />}
        </Desktop>
      </div>
      <List component="nav">
        <Divider />
        {modulesStore.activeModule.releases.slice().sort((a, b) => SemvarSorter(a.modVersion, b.modVersion)).map(release => {
          const editing = editingRelease === release.id;

          const releaseChip = <Chip label={`v${release.releaseVersion}`} size="small" />;
          const modChip = editing ? (
            <VersionSelect setCtVersionHook={setVersion} />
          ) : <Chip label={`v${release.modVersion}`} size="small" />;

          const onClickEditing = (): void => {
            if (editing) {
              setEditingRelease('');
              runInAction(() => {
                modulesStore.activeModule.releases = modulesStore.activeModule.releases.reduce((prev, curr) => {
                  if (curr.id !== release.id) prev.push(curr);
                  else prev.push({ ...curr, modVersion: version, changelog });

                  return prev;
                }, [] as IRelease[]);
              });

              updateRelease(modulesStore.activeModule.id, release.id, version, changelog);
              getModules();
            } else {
              setEditingRelease(release.id);
              setVersion(release.modVersion);
              setChangelog(release.changelog);
            }
          };

          const onClickDelete = (): void => {
            if (editing) {
              setEditingRelease('');
            } else {
              setDeletingRelease(release.id);
            }
          };

          const label = (
            <div className={classes.releaseTitle}>
              <Desktop>
                {authed ? (
                  <>
                    <IconButton className={classes.editButton} size="small" onClick={onClickEditing}>
                      {editing ? <CheckIcon /> : <EditIcon />}
                    </IconButton>
                    <IconButton className={classes.deleteButton} size="small" onClick={onClickDelete}>
                      {editing ? <ClearIcon /> : <DeleteIcon />}
                    </IconButton>
                  </>
                ) : <div />}
              </Desktop>
              {releaseChip}
              <Typography className={classes.releaseTypography}>for ct</Typography>
              {modChip}
            </div>
          );

          return (
            <div key={release.id}>
              <ListItem style={{ padding: 0 }}>
                <ListItemText primary={label} />
                <Desktop>
                  <Button
                    className={classes.releasesDownloadButton}
                    variant="contained"
                    size="small"
                    onClick={onCopyCommand}
                  >
                    Copy Import Command
                  </Button>
                  <Button
                    className={classes.releasesDownloadButton}
                    variant="contained"
                    size="small"
                    onClick={onDownloadScripts(release.id)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                      <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
                    </svg>
                    Download
                  </Button>
                </Desktop>
                <IconButton onClick={() => setOpenedRelease(release.id)}>
                  {openedRelease === release.id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
              </ListItem>
              <Collapse
                in={openedRelease === release.id}
                timeout="auto"
                unmountOnExit
              >
                <Divider className={classes.descDivider} />
                <div className={classes.releaseBody}>
                  <Typography>
                    Downloads:
                    {` ${release.downloads}`}
                  </Typography>
                  <br />
                  <Typography>Changelog:</Typography>
                  {editing ? (
                    <MarkdownEditor
                      value={changelog}
                      handleChange={setChangelog}
                    />
                  ) : <MarkdownRenderer source={release.changelog} />}
                </div>
              </Collapse>
              <Divider />
            </div>
          );
        })}
      </List>
      {modulesStore.activeModule.releases.length === 0 && (
        <Typography variant="body1">
          No releases
        </Typography>
      )}
    </>
  );
});

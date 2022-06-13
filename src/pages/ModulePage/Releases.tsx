import {
  Button,
  Chip,
  Collapse,
  colors,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Theme,
  Tooltip,
  Typography,
} from '@material-ui/core';
import {
  Check as CheckIcon,
  Clear as ClearIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
} from '@material-ui/icons';
import { makeStyles } from '@material-ui/styles';
import React from 'react';

import { BASE_URL, getModules } from '~api';
import { updateRelease } from '~api/raw';
import CreateReleaseDialog from '~components/Desktop/CreateReleaseDialog';
import DeleteReleaseDialog from '~components/Desktop/DeleteReleaseDialog';
import VersionSelect from '~components/Desktop/VersionSelect';
import MarkdownEditor from '~components/MarkdownEditor';
import MarkdownRenderer from '~components/MarkdownRenderer';
import SemvarSorter from '~components/utils/SemvarSorter';
import {
  action,
  authStore,
  errorStore,
  modulesStore,
  observer,
  runInAction,
} from '~store';
import { IRelease } from '~types';

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
  pendingChip: {
    marginLeft: 10,
  },
}));

const pendingChipText =
  'This release must be verified by one of our trusted community members. ' +
  'This release is only visible to you, the module creator.';

export default observer(() => {
  const classes = useStyles();
  const authed =
    authStore.isTrustedOrHigher ||
    (authStore.user && authStore.user.id === modulesStore.activeModule.owner.id);

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

  const onDownloadScripts = (releaseId: string): (() => void) =>
    action((): void => {
      window.open(
        `${BASE_URL}/modules/${modulesStore.activeModule.id}/releases/${releaseId}?file=scripts`,
        'scripts.zip',
      );
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
      <CreateReleaseDialog open={creatingRelease} onClose={closeCreatingDialog} />
      <div className={classes.title}>
        <Typography variant="subtitle1">Releases</Typography>
        {authed ? (
          <Button variant="contained" color="primary" onClick={openCreatingDialog}>
            Create Release
          </Button>
        ) : (
          <div />
        )}
      </div>
      <List component="nav">
        <Divider />
        {modulesStore.activeModule.releases
          .slice()
          .sort((a, b) => SemvarSorter(a.modVersion, b.modVersion))
          .map(release => {
            const editing = editingRelease === release.id;

            const releaseChip = (
              <Chip label={`v${release.releaseVersion}`} size="small" />
            );
            const modChip = editing ? (
              <VersionSelect ctVersion={version} setCtVersion={setVersion} />
            ) : (
              <Chip label={`v${release.modVersion}`} size="small" />
            );
            const pendingChip =
              release.verified !== false ? null : (
                <Tooltip title={pendingChipText} placement="top">
                  <Chip
                    className={classes.pendingChip}
                    label="Verification Pending"
                    size="small"
                    style={{ color: 'yellow' }}
                  />
                </Tooltip>
              );

            const onClickEditing = (): void => {
              if (editing) {
                setEditingRelease('');
                runInAction(() => {
                  modulesStore.activeModule.releases =
                    modulesStore.activeModule.releases.reduce((prev, curr) => {
                      if (curr.id !== release.id) prev.push(curr);
                      else prev.push({ ...curr, modVersion: version, changelog });

                      return prev;
                    }, [] as IRelease[]);
                });

                try {
                  updateRelease(
                    modulesStore.activeModule.id,
                    release.id,
                    version,
                    changelog,
                  );
                  getModules();
                } catch (e) {
                  const err = e as Error;
                  errorStore.setError('Error updating release', err.message);
                }
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
                {authed ? (
                  <>
                    <IconButton
                      className={classes.editButton}
                      size="small"
                      onClick={onClickEditing}
                    >
                      {editing ? <CheckIcon /> : <EditIcon />}
                    </IconButton>
                    <IconButton
                      className={classes.deleteButton}
                      size="small"
                      onClick={onClickDelete}
                    >
                      {editing ? <ClearIcon /> : <DeleteIcon />}
                    </IconButton>
                  </>
                ) : (
                  <div />
                )}
                {releaseChip}
                <Typography className={classes.releaseTypography}>for ct</Typography>
                {modChip}
                {pendingChip}
              </div>
            );

            return (
              <div key={release.id}>
                <ListItem style={{ padding: 0 }}>
                  <ListItemText primary={label} />
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
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                    >
                      <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
                    </svg>
                    Download
                  </Button>
                  <IconButton onClick={() => setOpenedRelease(release.id)}>
                    {openedRelease === release.id ? (
                      <ExpandLessIcon />
                    ) : (
                      <ExpandMoreIcon />
                    )}
                  </IconButton>
                </ListItem>
                <Collapse in={openedRelease === release.id} timeout="auto" unmountOnExit>
                  <Divider className={classes.descDivider} />
                  <div className={classes.releaseBody}>
                    <Typography>
                      Downloads:
                      {` ${release.downloads}`}
                    </Typography>
                    <br />
                    <Typography>Changelog:</Typography>
                    {editing ? (
                      <MarkdownEditor value={changelog} handleChange={setChangelog} />
                    ) : (
                      <MarkdownRenderer source={release.changelog} />
                    )}
                  </div>
                </Collapse>
                <Divider />
              </div>
            );
          })}
      </List>
      {modulesStore.activeModule.releases.length === 0 && (
        <Typography variant="body1">No releases</Typography>
      )}
    </>
  );
});

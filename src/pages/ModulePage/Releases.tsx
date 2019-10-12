import React from 'react';
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  Input,
  InputAdornment,
  Collapse,
  Divider,
  FormControl,
  Chip,
  IconButton,
  Button,
  colors,
  Theme,
} from '@material-ui/core';
import {
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
  Delete as DeleteIcon,
} from '@material-ui/icons';
import { makeStyles } from '@material-ui/styles';
import { Desktop } from '~components/utils/DeviceUtils';
import MarkdownEditor from '~components/MarkdownEditor';
import MarkdownRenderer from '~components/MarkdownRenderer';
import { BASE_URL } from '~api';
import { action, modulesStore } from '~store';

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
  deleteReleaseButton: {
    backgroundColor: colors.red[300],
    marginRight: theme.spacing(2),
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
}));

interface IModulePageReleasesProps {
  editing: boolean;
  openRelease: string;
  setOpenDialog(type: OpenDialog, releaseId?: string): (() => void);
  setOpenRelease(releaseId: string): (() => void);
  onChangeReleaseModVersion(id: string): ((e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void);
  onChangeReleaseChangelog(id: string): ((description: string) => void);
}

export default ({
  editing, setOpenDialog, onChangeReleaseChangelog, onChangeReleaseModVersion, openRelease, setOpenRelease,
}: IModulePageReleasesProps): JSX.Element => {
  const classes = useStyles();

  const onDownloadScripts = (releaseId: string): (() => void) => action((): void => {
    window.open(`${BASE_URL}/modules/${modulesStore.activeModule.id}/releases/${releaseId}?file=scripts`, 'scripts.zip');
  });

  return (
    <>
      <div className={classes.title}>
        <Typography variant="subtitle1">
        Releases
        </Typography>
        {editing && (
          <Button variant="contained" color="primary" onClick={setOpenDialog('add')}>
            Create Release
          </Button>
        )}
      </div>
      <List component="nav">
        <Divider />
        {modulesStore.activeModule.releases.slice().sort((a, b) => b.createdAt - a.createdAt).map(release => {
          const releaseChip = <Chip label={`v${release.releaseVersion}`} size="small" />;
          const modChip = editing ? (
            <FormControl margin="none">
              <Input
                value={release.modVersion}
                onChange={onChangeReleaseModVersion(release.id)}
                startAdornment={<InputAdornment style={{ marginRight: 0 }} position="start">v</InputAdornment>}
              />
            </FormControl>
          ) : <Chip label={`v${release.modVersion}`} size="small" />;

          const label = (
            <div className={classes.releaseTitle}>
              {editing && (
                <IconButton
                  className={classes.deleteReleaseButton}
                  onClick={setOpenDialog('delete', release.id)}
                  size="small"
                >
                  <DeleteIcon />
                </IconButton>
              )}
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
                    onClick={onDownloadScripts(release.id)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                      <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
                    </svg>
                  Download
                  </Button>
                </Desktop>
                <IconButton onClick={setOpenRelease(release.id)}>
                  {openRelease === release.id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
              </ListItem>
              <Collapse
                in={openRelease === release.id}
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
                      value={release.changelog}
                      handleChange={onChangeReleaseChangelog(release.id)}
                    />
                  ) : module && <MarkdownRenderer source={release.changelog} />}
                </div>
              </Collapse>
              <Divider />
            </div>
          );
        })}
      </List>
    </>
  );
};

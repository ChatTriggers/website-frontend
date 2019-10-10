import React from 'react';
import {
  Paper,
  Typography,
  FormControl,
  Select,
  Chip,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  Input,
  InputAdornment,
  Collapse,
  Divider,
  Button,
  Theme,
  withStyles,
} from '@material-ui/core';
import { ExpandLess as ExpandLessIcon, ExpandMore as ExpandMoreIcon } from '@material-ui/icons';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import {
  observer,
  observable,
  action,
  modulesStore,
  runInAction,
} from '~store';
import MarkdownRenderer from '~components/MarkdownRenderer';
import MarkdownEditor from '~components/MarkdownEditor';
import TagList from '~components/Module/TagList';
import { getModules, updateRelease } from '~api/raw';
import { StyledComponent, Styles } from '~components';
import ModuleActions from '~components/Module/ModuleActions';
import CreateReleaseDialog from '~components/Desktop/CreateReleaseDialog';
import { IModule, IRelease } from '~types';
import { updateModule } from '~api';

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
  header: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  title: {
    width: '100%',
    display: 'inline-block',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  titleChip: {
    display: 'flex',
  },
  versionChip: {
    marginRight: theme.spacing(1),
  },
  body: {
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(2, 2, 0, 2),
  },
  imageOuter: {
    alignSelf: 'center',
    justifySelf: 'center',
    flexGrow: 1,
    paddingLeft: 0,
  },
  image: {
    // height: '100%',
    maxWidth: `calc(100vw - ${theme.spacing(2) * 4}px)`,
    maxHeight: '180px',
    objectFit: 'contain',
  },
  backButton: {
    marginRight: theme.spacing(2),
  },
  actions: {
    width: 180,
  },
  tagSelect: {
    width: '100%',
  },
  releaseTitle: {
    display: 'flex',
    alignItems: 'center',
  },
  releaseTypography: {
    padding: theme.spacing(0, 1),
  },
  descDivider: {
    margin: theme.spacing(0, 4, 1, 4),
  },
  releaseBody: {
    padding: theme.spacing(0, 4),
  },
  releasesTitle: {
    [theme.breakpoints.up('lg')]: {
      display: 'flex',
      justifyContent: 'space-between',
    },
  },
});

@observer
class ModulePage extends StyledComponent<typeof styles, ModuleProps> {
  @observable
  private module: IModule | undefined;

  @observable
  private changedDescription = false;

  @observable
  private changedTags = false;

  @observable
  private changedReleases: string[] = [];

  @observable
  private editing = false;

  @observable
  private openRelease = '';

  @observable
  private addReleaseDialogOpen = false;

  @action
  private onOpenReleaseDialog = (): void => {
    this.addReleaseDialogOpen = true;
  }

  @action
  private onCloseReleaseDialog = (): void => {
    this.addReleaseDialogOpen = false;
  }

  @action
  private addRelease = (release: IRelease): void => {
    if (this.module) this.module.releases.push(release);
  }

  private onReleaseClick = (id: string): (() => void) => action(() => {
    if (this.openRelease === id) {
      this.openRelease = '';
    } else {
      this.openRelease = id;
    }
  });

  @action
  private setEditing = async (editing: boolean): Promise<void> => {
    this.editing = editing;

    if (!editing && this.module) {
      await updateModule(
        this.module.id,
        this.changedDescription ? this.module.description : undefined,
        undefined,
        undefined,
        this.changedTags ? this.module.tags : undefined,
      );

      this.changedReleases
        .map(releaseId => this.module && this.module.releases.find(r => r.id === releaseId))
        .filter(n => !!n)
        .map(n => n as IRelease)
        .forEach(release => {
          if (!this.module) return;

          updateRelease(this.module.id, release.id, release.modVersion, release.changelog);
        });

      runInAction(() => {
        this.changedDescription = false;
        this.changedTags = false;
        this.changedReleases = [];
      });
    }
  }

  @action
  private onChangeDescription = (description: string): void => {
    this.changedDescription = true;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.module!.description = description;
  }

  @action
  private onChangeTags = (e: React.ChangeEvent<{ name?: string; value: unknown }>): void => {
    this.changedTags = true;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.module!.tags = e.target.value as string[];
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  private onChangeReleaseChangelog = (releaseId: string) => action((changelog: string): void => {
    if (!this.module) return;
    if (!this.changedReleases.includes(releaseId)) this.changedReleases.push(releaseId);

    this.module.releases = this.module.releases.reduce((prev, curr) => {
      if (curr.id !== releaseId) prev.push(curr);
      else prev.push({ ...curr, changelog });

      return prev;
    }, [] as IRelease[]);
  })

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  private onChangeReleaseModVersion = (releaseId: string) => action(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
      if (!this.module) return;
      if (!this.changedReleases.includes(releaseId)) this.changedReleases.push(releaseId);

      const modVersion = e.target.value;

      this.module.releases = this.module.releases.reduce((prev, curr) => {
        if (curr.id !== releaseId) prev.push(curr);
        else prev.push({ ...curr, modVersion });

        return prev;
      }, [] as IRelease[]);
    },
  )

  @action
  public async componentDidMount(): Promise<void> {
    const moduleName = this.props.match.params.module;

    // Attempt to first find module in the modulesStore
    let temp = modulesStore.modules.find(m => m.name.toString().toLowerCase() === moduleName.toLowerCase());

    // TODO: Handle error
    if (temp) this.module = { ...temp };

    if (!this.module) {
      // If the module isn't already loaded in the store, get it from the backend
      const response = await getModules(1, 0, undefined, undefined, undefined, undefined, moduleName);

      if (response.modules.length !== 1) {
        // TODO: Display error on screen
        throw new Error(`No module with name ${moduleName} found`);
      }

      runInAction(() => {
        [temp] = response.modules;

        // TODO: Handle error
        if (!temp) return;

        this.module = { ...temp };
      });
    }
  }

  public render(): JSX.Element {
    return (this.module && (
      <div className={this.classes.root}>
        {this.module && (
          <CreateReleaseDialog
            moduleId={this.module.id}
            moduleName={this.module.name}
            open={this.addReleaseDialogOpen}
            addRelease={this.addRelease}
            onClose={this.onCloseReleaseDialog}
          />
        )}
        <Paper
          className={this.classes.paper}
          elevation={4}
        >
          <div className={this.classes.header}>
            <div>
              <Typography
                className={this.classes.title}
                variant="h5"
              >
                {this.module.name}
              </Typography>
              <Typography
                className={this.classes.title}
                variant="h6"
              >
                By
                {' '}
                {this.module.owner.name}
              </Typography>
            </div>
            <ModuleActions
              className={this.classes.actions}
              module={this.module}
              editing={this.editing}
              setEditing={this.setEditing}
            />
          </div>
          {this.module.image && (
            <div className={this.classes.body}>
              <div className={this.classes.imageOuter}>
                <img
                  className={this.classes.image}
                  src={this.module.image}
                  alt="Module"
                />
              </div>
            </div>
          )}
        </Paper>
        <Paper
          className={this.classes.paper}
          elevation={4}
        >
          {this.editing ? (
            <MarkdownEditor
              value={this.module.description}
              handleChange={this.onChangeDescription}
            />
          ) : <MarkdownRenderer source={this.module.description} />}
        </Paper>
        {this.module.tags.length > 0 && (
          <Paper
            className={this.classes.paper}
            elevation={4}
          >
            <Typography variant="subtitle1">
              Tags
            </Typography>
            {this.editing ? (
              <FormControl className={this.classes.tagSelect}>
                <Select
                  multiple
                  value={this.module.tags}
                  onChange={this.onChangeTags}
                  renderValue={(tags: unknown) => (
                    <div>
                      {(tags as string[]).map(tag => <Chip key={tag} label={tag} />)}
                    </div>
                  )}
                >
                  {modulesStore.allowedTags.map(tag => (
                    <MenuItem key={tag} value={tag}>
                      {tag}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : <TagList tags={this.module.tags} maxTags={99} />}
          </Paper>
        )}
        {this.module.releases.length > 0 && (
          <Paper
            className={this.classes.paper}
            elevation={4}
          >
            <div className={this.classes.releasesTitle}>
              <Typography variant="subtitle1">
                Releases
              </Typography>
              {this.editing && (
                <Button variant="contained" color="primary" onClick={this.onOpenReleaseDialog}>
                  Create Release
                </Button>
              )}
            </div>
            <List component="nav">
              <Divider />
              {this.module.releases.slice().sort((a, b) => b.createdAt - a.createdAt).map(release => {
                const releaseChip = <Chip label={`v${release.releaseVersion}`} size="small" />;
                const modChip = this.editing ? (
                  <FormControl margin="none">
                    <Input
                      value={release.modVersion}
                      onChange={this.onChangeReleaseModVersion(release.id)}
                      startAdornment={<InputAdornment style={{ marginRight: 0 }} position="start">v</InputAdornment>}
                    />
                  </FormControl>
                ) : <Chip label={`v${release.modVersion}`} size="small" />;

                const label = (
                  <div className={this.classes.releaseTitle}>
                    {releaseChip}
                    <Typography className={this.classes.releaseTypography}>for ct</Typography>
                    {modChip}
                  </div>
                );

                return (
                  <div key={release.id}>
                    <ListItem button onClick={this.onReleaseClick(release.id)}>
                      <ListItemText primary={label} />
                      {this.openRelease === release.id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </ListItem>
                    <Collapse
                      in={this.openRelease === release.id}
                      timeout="auto"
                      unmountOnExit
                    >
                      <Divider className={this.classes.descDivider} />
                      <div className={this.classes.releaseBody}>
                        <Typography>
                          Downloads:
                          {` ${release.downloads}`}
                        </Typography>
                        <br />
                        <Typography>Changelog:</Typography>
                        {this.editing ? (
                          <MarkdownEditor
                            value={release.changelog}
                            handleChange={this.onChangeReleaseChangelog(release.id)}
                          />
                        ) : this.module && <MarkdownRenderer source={release.changelog} />}
                      </div>
                    </Collapse>
                    <Divider />
                  </div>
                );
              })}
            </List>
          </Paper>
        )}
      </div>
    )) || <div />;
  }
}

export default withStyles(styles)(withRouter(ModulePage));

import React from 'react';
import {
  Paper,
  Typography,
  FormControl,
  Select,
  Chip,
  MenuItem,
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
import MarkdownRenderer from '~components/MarkdownRenderer';
import MarkdownEditor from '~components/MarkdownEditor';
import TagList from '~components/Module/TagList';
import DeleteReleaseDialog from '~components/Desktop/DeleteReleaseDialog';
import { getModules, updateRelease } from '~api/raw';
import { StyledComponent, Styles } from '~components';
import CreateReleaseDialog from '~components/Desktop/CreateReleaseDialog';
import ModulePageHeader from './Header';
import ModulePageReleases, { OpenDialog } from './Releases';
import { IRelease } from '~types';
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
  private editing = false;

  @observable
  private editedFields = {
    description: false,
    tags: false,
    releases: [] as string[],
  }

  @observable
  private openRelease = '';

  @observable
  private deletingReleaseId = '';

  @observable
  private openDialog: OpenDialog = 'none';

  private setOpenDialog = (dialog: OpenDialog, deletingRelease?: string): (() => void) => action(() => {
    this.openDialog = dialog;
    this.deletingReleaseId = deletingRelease || '';
  });

  private setOpenRelease = (id: string): (() => void) => action(() => {
    this.openRelease = this.openRelease === id ? '' : id;
  });

  @action
  private setEditing = async (editing: boolean): Promise<void> => {
    this.editing = editing;

    if (!editing && modulesStore.activeModule) {
      await updateModule(
        modulesStore.activeModule.id,
        this.editedFields.description ? modulesStore.activeModule.description : undefined,
        undefined,
        undefined,
        this.editedFields.tags ? modulesStore.activeModule.tags : undefined,
      );

      this.editedFields.releases
        .map(releaseId => modulesStore.activeModule && modulesStore.activeModule.releases.find(r => r.id === releaseId))
        .filter(n => !!n)
        .map(n => n as IRelease)
        .forEach(release => {
          updateRelease(modulesStore.activeModule.id, release.id, release.modVersion, release.changelog);
        });

      runInAction(() => {
        this.editedFields = {
          description: false,
          tags: false,
          releases: [],
        };
      });
    }
  }

  @action
  private onChangeDescription = (description: string): void => {
    this.editedFields.description = true;
    modulesStore.activeModule.description = description;
  }

  @action
  private onChangeTags = (e: React.ChangeEvent<{ name?: string; value: unknown }>): void => {
    this.editedFields.tags = true;
    modulesStore.activeModule.tags = e.target.value as string[];
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  private onChangeReleaseChangelog = (releaseId: string) => action((changelog: string): void => {
    if (!this.editedFields.releases.includes(releaseId)) this.editedFields.releases.push(releaseId);

    modulesStore.activeModule.releases = modulesStore.activeModule.releases.reduce((prev, curr) => {
      if (curr.id !== releaseId) prev.push(curr);
      else prev.push({ ...curr, changelog });

      return prev;
    }, [] as IRelease[]);
  })

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  private onChangeReleaseModVersion = (releaseId: string) => action(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
      if (!this.editedFields.releases.includes(releaseId)) this.editedFields.releases.push(releaseId);

      const modVersion = e.target.value;

      modulesStore.activeModule.releases = modulesStore.activeModule.releases.reduce((prev, curr) => {
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

    if (temp) modulesStore.activeModule = { ...temp };

    if (modulesStore.activeModule.id === -1) {
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

        modulesStore.activeModule = { ...temp };
      });
    }
  }

  public render(): JSX.Element {
    return (modulesStore.activeModule && (
      <div className={this.classes.root}>
        {modulesStore.activeModule && (
          <CreateReleaseDialog
            open={this.openDialog === 'add'}
            onClose={this.setOpenDialog('none')}
          />
        )}
        <DeleteReleaseDialog
          open={this.openDialog === 'delete'}
          close={this.setOpenDialog('none')}
          releaseId={this.deletingReleaseId}
        />
        <Paper className={this.classes.paper}>
          {modulesStore.activeModule && (
            <ModulePageHeader
              editing={this.editing}
              setEditing={this.setEditing}
            />
          )}
        </Paper>
        <Paper className={this.classes.paper}>
          {this.editing ? (
            <MarkdownEditor
              value={modulesStore.activeModule.description}
              handleChange={this.onChangeDescription}
            />
          ) : <MarkdownRenderer source={modulesStore.activeModule.description} />}
        </Paper>
        {modulesStore.activeModule.tags.length > 0 && (
          <Paper className={this.classes.paper}>
            <Typography variant="subtitle1">
              Tags
            </Typography>
            {this.editing ? (
              <FormControl className={this.classes.tagSelect}>
                <Select
                  multiple
                  value={modulesStore.activeModule.tags}
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
            ) : <TagList tags={modulesStore.activeModule.tags} maxTags={99} />}
          </Paper>
        )}
        {modulesStore.activeModule.releases.length > 0 && (
          <Paper className={this.classes.paper}>
            <ModulePageReleases
              editing={this.editing}
              openRelease={this.openRelease}
              setOpenDialog={this.setOpenDialog}
              setOpenRelease={this.setOpenRelease}
              onChangeReleaseModVersion={this.onChangeReleaseModVersion}
              onChangeReleaseChangelog={this.onChangeReleaseChangelog}
            />
          </Paper>
        )}
      </div>
    )) || <div />;
  }
}

export default withStyles(styles)(withRouter(ModulePage));

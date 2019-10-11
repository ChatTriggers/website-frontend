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
  private module: IModule | undefined;

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

  @action
  private addRelease = (release: IRelease): void => {
    if (this.module) this.module.releases.push(release);
  }

  @action
  private removeRelease = (releaseId: string): void => {
    if (this.module) this.module.releases = this.module.releases.filter(r => r.id !== releaseId);
  }

  private setOpenRelease = (id: string): (() => void) => action(() => {
    this.openRelease = this.openRelease === id ? '' : id;
  });

  @action
  private setEditing = async (editing: boolean): Promise<void> => {
    this.editing = editing;

    if (!editing && this.module) {
      await updateModule(
        this.module.id,
        this.editedFields.description ? this.module.description : undefined,
        undefined,
        undefined,
        this.editedFields.tags ? this.module.tags : undefined,
      );

      this.editedFields.releases
        .map(releaseId => this.module && this.module.releases.find(r => r.id === releaseId))
        .filter(n => !!n)
        .map(n => n as IRelease)
        .forEach(release => {
          if (!this.module) return;

          updateRelease(this.module.id, release.id, release.modVersion, release.changelog);
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
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.module!.description = description;
  }

  @action
  private onChangeTags = (e: React.ChangeEvent<{ name?: string; value: unknown }>): void => {
    this.editedFields.tags = true;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.module!.tags = e.target.value as string[];
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  private onChangeReleaseChangelog = (releaseId: string) => action((changelog: string): void => {
    if (!this.module) return;
    if (!this.editedFields.releases.includes(releaseId)) this.editedFields.releases.push(releaseId);

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
      if (!this.editedFields.releases.includes(releaseId)) this.editedFields.releases.push(releaseId);

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
            open={this.openDialog === 'add'}
            addRelease={this.addRelease}
            onClose={this.setOpenDialog('none')}
          />
        )}
        <DeleteReleaseDialog
          open={this.openDialog === 'delete'}
          close={this.setOpenDialog('none')}
          moduleId={this.module.id}
          releaseId={this.deletingReleaseId}
          removeRelease={this.removeRelease}
        />
        <Paper className={this.classes.paper}>
          {this.module && (
            <ModulePageHeader
              editing={this.editing}
              setEditing={this.setEditing}
              module={this.module}
            />
          )}
        </Paper>
        <Paper className={this.classes.paper}>
          {this.editing ? (
            <MarkdownEditor
              value={this.module.description}
              handleChange={this.onChangeDescription}
            />
          ) : <MarkdownRenderer source={this.module.description} />}
        </Paper>
        {this.module.tags.length > 0 && (
          <Paper className={this.classes.paper}>
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
          <Paper className={this.classes.paper}>
            <ModulePageReleases
              editing={this.editing}
              module={this.module}
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

import React from 'react';
import {
  Paper,
  Typography,
  Theme,
  withStyles,
} from '@material-ui/core';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import {
  observer,
  observable,
  action,
  modulesStore,
} from '~store';
import MarkdownRenderer from '~components/MarkdownRenderer';
import TagList from '~components/Module/TagList';
import { getModules } from '~api/raw';
import { StyledComponent, Styles } from '~components';
import ReleasesTable from '~components/Module/ReleasesTable';
import ModuleActions from '~components/Module/ModuleActions';
import { IModule } from '~types';

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
});

@observer
class ModulePage extends StyledComponent<typeof styles, ModuleProps> {
  @observable
  private module: IModule | undefined;

  @observable
  private deleteDialogOpen = false;

  @action
  private closeDeleteDialog = (): void => {
    this.deleteDialogOpen = false;
  }

  @action
  private openDeleteDialog = (): void => {
    this.deleteDialogOpen = true;
  }

  private onBackButtonClick = (): void => {
    this.props.history.push('/modules');
  }

  public async componentDidMount(): Promise<void> {
    const moduleName = this.props.match.params.module;

    action(() => {
      this.module = modulesStore.modules.find(m => m.name.toString().toLowerCase() === moduleName.toLowerCase());
    })();

    if (!this.module) {
      const response = await getModules(1, 0, undefined, undefined, undefined, undefined, moduleName);

      if (response.modules.length !== 1) {
        // TODO: Display error on screen
        throw new Error(`No module with name ${moduleName} found`);
      }

      action(() => {
        [this.module] = response.modules;
      })();
    }
  }

  public render(): JSX.Element {
    return (this.module && (
      <div className={this.classes.root}>
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
          <MarkdownRenderer source={this.module.description} />
        </Paper>
        {this.module.tags.length > 0 && (
          <Paper
            className={this.classes.paper}
            elevation={4}
          >
            <Typography variant="subtitle1">
                  Tags
            </Typography>
            <TagList tags={this.module.tags} maxTags={99} />
          </Paper>
        )}
        {this.module.releases.length > 0 && (
          <Paper
            className={this.classes.paper}
            elevation={4}
          >
            <Typography variant="subtitle1">
                  Releases
            </Typography>
            <ReleasesTable releases={this.module.releases} />
          </Paper>
        )}
      </div>
    )) || <div />;
  }
}

export default withStyles(styles)(withRouter(ModulePage));

import React from 'react';
import {
  Paper,
  Typography,
  IconButton,
  Theme,
  withStyles,
} from '@material-ui/core';
import { KeyboardArrowLeft as LeftIcon } from '@material-ui/icons';
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
import { IModule } from '~types';

type ModuleProps = RouteComponentProps<{ module: string }>

const styles: Styles = (theme: Theme) => ({
  root: {
    width: '100vw',
    minHeight: 'calc(100vh - 72px)',
  },
  paperContainer: {
    margin: 'auto',
    width: '100%',
    maxWidth: 320,
  },
  paper: {
    margin: theme.spacing(2),
    padding: theme.spacing(2),
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
});

@observer
class ModulePage extends StyledComponent<typeof styles, ModuleProps> {
  @observable
  private module: IModule | undefined;

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

  private DrawerButton = (
    <IconButton
      onClick={this.onBackButtonClick}
      edge="start"
      className={this.classes.backButton}
      size="medium"
    >
      <LeftIcon />
    </IconButton>
  );

  public render(): JSX.Element {
    return (this.module && (
      <div className={this.classes.root}>
        <Paper
          className={this.classes.paper}
          elevation={4}
        >
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

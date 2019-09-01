import React from 'react';
import {
  Paper,
  Container,
  Typography,
  Chip,
  Theme,
  Collapse
} from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import ReactMarkdown from 'react-markdown';
import { IModule as IModuleProps } from '~api';
import { authStore, observer, observable, action } from '~store';
import TagList from './TagList';
import ModuleActions from './ModuleActions';
import { StyledComponent } from '~components';
import EditModuleDialog from '~modules/Dialogs/EditModuleDialog';
import DeleteModuleDialog from '~modules/Dialogs/DeleteModuleDialog';
import { StyleRules } from '@material-ui/core/styles';
import ReleasesTable from './ReleasesTable';
import CodeBlock from '~components/MarkdownEditor/CodeBlock';

const maxTags = 3;

const styles = (theme: Theme): StyleRules => ({
  root: {
    margin: theme.spacing(5),
    maxWidth: 1250,
    padding: `${theme.spacing(2)}px 0`
  },
  titleContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignContent: 'center',
    paddingBottom: theme.spacing(2)
  },
  title: {
    marginRight: theme.spacing(3)
  },
  titleChip: {
    display: 'flex'
  },
  versionChip: {
    marginRight: theme.spacing(1)
  },
  body: {
    display: 'flex'
  },
  bodyMiddle: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  imageOuter: {
    // border: '3px solid gray',
    width: '300px',
    height: '200px',
    paddingLeft: 0
  },
  image: {
    width: '300px',
    height: '100%',
    objectFit: 'cover'
  },
  actions: {
    width: '300px'
  }
});

@observer
class Module extends StyledComponent<typeof styles, IModuleProps> {
  @observable
  private openDialog: 'edit' | 'delete' | 'releases' | undefined;

  @action
  private readonly onDialogClose = () => {
    this.openDialog = undefined;
  }

  @action
  private readonly setOpenDialog = (openDialog?: 'edit' | 'delete' | 'releases') => {
    this.openDialog = this.openDialog === openDialog ? undefined : openDialog;
  }

  public render() {
    return (
      <>
        <EditModuleDialog
          open={this.openDialog === 'edit'}
          close={this.onDialogClose}
          moduleId={this.props.id}
          description={this.props.description}
          image={this.props.image}
          tags={this.props.tags}
        />
        <DeleteModuleDialog
          open={this.openDialog === 'delete'}
          close={this.onDialogClose}
          moduleId={this.props.id}
        />
        <Paper
          className={this.classes.root}
          square
          elevation={4}
        >
          <Container className={this.classes.titleContainer}>
            <div className={this.classes.titleChip}>
              <Typography className={this.classes.title} variant="h5"><strong>{this.props.name}</strong></Typography>
              {this.props.releases.map(release => (
                <Chip
                  className={this.classes.versionChip}
                  key={release.id}
                  color="secondary"
                  size="small"
                  label={<Typography variant="body2">{release.modVersion}</Typography>}
                />
              ))}
            </div>
            <Typography variant="h6">By <strong>{this.props.owner.name}</strong></Typography>
          </Container>
          <Container className={this.classes.body}>
            <div className={this.classes.imageOuter}>
              <img className={this.classes.image} src={this.props.image || 'https://www.chattriggers.com/default.png'} alt="Module" />
            </div>
            <Container className={this.classes.bodyMiddle}>
              <ReactMarkdown
                source={this.props.description}
                skipHtml={true}
                renderers={{ code: CodeBlock }}
              />
              <TagList tags={this.props.tags} maxTags={maxTags} />
            </Container>
            <ModuleActions
              className={this.classes.actions}
              authed={(authStore.user && authStore.user.id === this.props.owner.id) || false}
              module={this.props}
              setOpenDialog={this.setOpenDialog}
            />
          </Container>
          <Collapse in={this.openDialog === 'releases'}>
            <ReleasesTable releases={this.props.releases} />
          </Collapse>
        </Paper>
      </>
    );
  }
}

export default withStyles(styles, { withTheme: true })(Module);

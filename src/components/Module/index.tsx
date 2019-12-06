import React from 'react';
import {
  Paper,
  Typography,
  Button,
  IconButton,
  Theme,
} from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { StyleRulesCallback } from '@material-ui/styles/withStyles';
import {
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
} from '@material-ui/icons';
import clsx from 'clsx';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { IModule } from '~types';
import MarkdownRenderer from '~components/MarkdownRenderer';
import { observer, observable, action } from '~store';
import StyledComponent from '~components/utils/StyledComponent';

const styles: StyleRulesCallback<Theme, object> = (theme: Theme) => ({
  root: {
    [theme.breakpoints.only('xs')]: {
      margin: theme.spacing(2),
    },
    [theme.breakpoints.between('sm', 'md')]: {
      margin: theme.spacing(3),
    },
    [theme.breakpoints.up('lg')]: {
      margin: theme.spacing(2, 4),
      padding: theme.spacing(1),
      width: '100%',
      maxWidth: `calc(1000px - ${theme.spacing(1) * 2}px)`,
    },
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleContainer: {
    padding: theme.spacing(2, 0, 0, 2),
    width: `calc(100% - 64px - ${theme.spacing(2) * 3}px)`,
  },
  title: {
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
    width: '90%',
    padding: theme.spacing(2, 2, 0, 2),
    [theme.breakpoints.up('md')]: {
      flexDirection: 'row',
    },
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
    },
  },
  imageOuter: {
    alignSelf: 'center',
    justifySelf: 'center',
    marginBottom: theme.spacing(2),
    [theme.breakpoints.up('md')]: {
      maxWidth: 320,
      padding: theme.spacing(0, 2, 0, 0),
    },
    [theme.breakpoints.down('sm')]: {
      flexGrow: 1,
      paddingLeft: 0,
    },
  },
  image: {
    maxHeight: '180px',
    objectFit: 'contain',
    maxWidth: 320,
  },
  actions: {
    width: '300px',
  },
  viewButton: {
    margin: theme.spacing(4, 2, 2, 0),
  },
  expandButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
  },
});

interface IModuleProps extends RouteComponentProps<{}> {
  module: IModule;
}

@observer
class Module extends StyledComponent<typeof styles, IModuleProps> {
  @observable
  private height: number | undefined = 300;

  @observable
  private collapsable = false;

  @observable
  private isCollapsed = true;

  private markdownRef = React.createRef<HTMLDivElement>();

  @action
  public componentDidMount(): void {
    this.collapsable = (this.markdownRef.current && this.markdownRef.current.clientHeight === this.height) || false;
  }

  @action
  private onClickModule = (): void => {
    const { history, module } = this.props;
    history.push(`/modules/v/${module.name}`);
  }

  @action
  private toggleExpand = (): void => {
    if (this.height) {
      this.height = undefined;
    } else {
      this.height = 300;
    }
  }

  public render(): JSX.Element {
    const { module } = this.props;

    return (
      <Paper className={this.classes.root}>
        <div className={this.classes.header}>
          <div className={this.classes.titleContainer}>
            <div className={this.classes.titleChip}>
              <Typography className={this.classes.title} variant="h5">
                {module.name}
              </Typography>
            </div>
            <Typography className={this.classes.title} variant="h6">
                By
              {' '}
              {module.owner.name}
            </Typography>
          </div>
          <Button
            className={this.classes.viewButton}
            color="primary"
            variant="contained"
            onClick={this.onClickModule}
          >
              View
          </Button>
        </div>
        <div className={this.classes.body}>
          {module.image && (
            <div className={this.classes.imageOuter}>
              <img
                className={this.classes.image}
                src={module.image}
                alt="Module"
              />
            </div>
          )}
          <div ref={this.markdownRef} style={{ maxHeight: this.height, overflow: 'hidden', marginBottom: this.collapsable ? 12 : 0 }}>
            <MarkdownRenderer source={module.description} />
          </div>
        </div>
        <div style={{ position: 'relative' }}>
          {this.collapsable && (
            <Button
              className={clsx(this.classes.viewButton, this.classes.expandButton)}
              color="primary"
              variant="contained"
              onClick={this.toggleExpand}
            >
              <IconButton size="small">
                {this.height ? <KeyboardArrowDownIcon /> : <KeyboardArrowUpIcon />}
              </IconButton>
            </Button>
          )}
        </div>
      </Paper>
    );
  }
}

export default withStyles(styles, { withTheme: true })(withRouter(Module));

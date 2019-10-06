import React from 'react';
import {
  Paper,
  Typography,
  Button,
  Theme,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { IModule } from '~types';
import MarkdownRenderer from '~components/MarkdownRenderer';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    margin: theme.spacing(2),
    width: `calc(100vw - ${theme.spacing(2) * 2}px)`,
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
    maxWidth: `calc(100vw - ${theme.spacing(2) * 4}px)`,
    maxHeight: '180px',
    objectFit: 'contain',
  },
  actions: {
    width: '300px',
  },
  markdownViewer: {
    padding: theme.spacing(2, 0),
  },
  viewButton: {
    margin: theme.spacing(4, 2, 2, 0),
  },
}));

interface IModuleProps extends RouteComponentProps<{}> {
  module: IModule;
}

export default withRouter(({ module, history }: IModuleProps) => {
  const classes = useStyles();

  const onClickModule = (): void => {
    history.push(`/modules/search/${module.name}`);
  };

  return (
    <Paper
      className={classes.root}
      elevation={4}
    >
      <div className={classes.header}>
        <div className={classes.titleContainer}>
          <div className={classes.titleChip}>
            <Typography className={classes.title} variant="h5">
              {module.name}
            </Typography>
          </div>
          <Typography className={classes.title} variant="h6">
            By
            {' '}
            {module.owner.name}
          </Typography>
        </div>
        <Button
          className={classes.viewButton}
          color="primary"
          variant="contained"
          onClick={onClickModule}
        >
          View
        </Button>
      </div>
      <div className={classes.body}>
        {module.image && (
          <div className={classes.imageOuter}>
            <img
              className={classes.image}
              src={module.image}
              alt="Module"
            />
          </div>
        )}
        <div className={classes.markdownViewer}>
          <MarkdownRenderer source={module.description} />
        </div>
      </div>
    </Paper>
  );
});

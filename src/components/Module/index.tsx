import React from 'react';
import {
  Paper,
  Typography,
  Theme
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { IModule as IModuleProps } from '~api';
import MarkdownRenderer from '~components/MarkdownRenderer';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    margin: theme.spacing(2),
    width: `calc(100vw - ${theme.spacing(2) * 2}px)`,
  },
  titleContainer: {
    padding: theme.spacing(2, 2, 0, 2)
  },
  title: {
    marginRight: theme.spacing(2)
  },
  titleChip: {
    display: 'flex'
  },
  versionChip: {
    marginRight: theme.spacing(1)
  },
  body: {
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(2, 2, 0, 2)
  },
  imageOuter: {
    alignSelf: 'center',
    justifySelf: 'center',
    flexGrow: 1,
    paddingLeft: 0
  },
  image: {
    // height: '100%',
    maxWidth: `calc(100vw - ${theme.spacing(2) * 4}px)`,
    maxHeight: '180px',
    objectFit: 'contain'
  },
  actions: {
    width: '300px'
  },
  markdownViewer: {
    padding: theme.spacing(2, 0)
  }
}));

export default (props: IModuleProps) => {
  const classes = useStyles();

  return (
    <Paper
      className={classes.root}
      elevation={4}
    >
      <div className={classes.titleContainer}>
        <div className={classes.titleChip}>
          <Typography className={classes.title} variant="h5"><strong>{props.name}</strong></Typography>
        </div>
        <Typography variant="h6">By <strong>{props.owner.name}</strong></Typography>
      </div>
      <div className={classes.body}>
        <div className={classes.imageOuter}>
          <img className={classes.image} src={props.image || 'https://www.chattriggers.com/default.png'} alt="Module" />
        </div>
        <div className={classes.markdownViewer}>
          <MarkdownRenderer source={props.description} />
        </div>
      </div>
    </Paper>
  );
};

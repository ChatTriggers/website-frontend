import React from 'react';
import {
  Paper,
  Theme,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    [theme.breakpoints.down('md')]: {
      width: '100vw',
      height: 'calc(100vh - 56px)',
    },
    [theme.breakpoints.up('lg')]: {
      width: '100%',
      height: 'calc(100vh - 64px)',
    },
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center',
  },
  paperContainer: {
    margin: 'auto',
    width: '100%',
    [theme.breakpoints.only('xs')]: {
      maxWidth: 320,
    },
    [theme.breakpoints.up('sm')]: {
      maxWidth: 600,
    },
  },
  paper: {
    margin: theme.spacing(2),
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
}));

export default (): JSX.Element => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.paperContainer}>
        <Paper className={classes.paper}>
          <Typography variant="h5">
            No internet connection
          </Typography>
          <Typography variant="body1">
            It seems you aren&apos;t connected to the internet. Reconnect to view the website!
          </Typography>
        </Paper>
      </div>
    </div>
  );
};

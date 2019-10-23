import React from 'react';
import {
  Paper,
  Typography,
  Theme,
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    [theme.breakpoints.only('xs')]: {
      margin: theme.spacing(2),
      padding: theme.spacing(2),
    },
    [theme.breakpoints.between('sm', 'md')]: {
      margin: theme.spacing(3),
      padding: theme.spacing(3),
    },
    [theme.breakpoints.up('lg')]: {
      margin: theme.spacing(2, 4),
      padding: theme.spacing(4),
    },
  },
  body: {
    marginTop: theme.spacing(3),
  },
}));

export default (): JSX.Element => {
  const classes = useStyles();

  return (
    <Paper className={classes.root}>
      <Typography variant="h4">
        Module not found
      </Typography>
      <Typography variant="body1" className={classes.body}>
        Oops! It seems you&apos;ve tried to access a module that doesn&apos;t exist. Click
        {' '}
        <Link to="/modules">here</Link>
        {' '}
        to go back to the list of modules
      </Typography>
    </Paper>
  );
};

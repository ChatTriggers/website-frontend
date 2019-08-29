import React from 'react';
import {
  Paper, 
  Container,
  Typography,
  Theme
} from '@material-ui/core';
import { makeStyles, createStyles } from '@material-ui/styles';

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    margin: theme.spacing(5),
    padding: `${theme.spacing(2)}px 0`
  },
  title: {
    display: 'flex',
    justifyContent: 'space-between',
    alignContent: 'center',
    paddingBottom: theme.spacing(2)
  },
  body: {
    display: 'flex'
  }
}));

export default () => {
  const classes = useStyles({});

  return (
    <Paper
      className={classes.root}
      square
      elevation={4}
    >
      <Container className={classes.title}>
        <Typography variant="h5">
          Error loading modules
        </Typography>
      </Container>
      <Container className={classes.body}>
        <Typography>
          An error occurred while connecting to the database.
          Please try again later.
        </Typography>
      </Container>
    </Paper>
  );
};

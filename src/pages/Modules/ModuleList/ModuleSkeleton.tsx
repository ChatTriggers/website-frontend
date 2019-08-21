import React from 'react';
import { Paper, Container, Theme } from '@material-ui/core';
import { makeStyles, createStyles } from '@material-ui/styles';
import Skeleton from '@material-ui/lab/Skeleton';
import { view } from 'react-easy-state';

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    margin: theme.spacing(5),
    padding: `${theme.spacing(2)}px 0`,
    animation: '1s $fadeIn'
  },
  title: {
    display: 'flex',
    justifyContent: 'space-between',
    alignContent: 'center',
    paddingBottom: theme.spacing(1)
  },
  body: {
    display: 'flex'
  },
  imageOuter: {
    width: '300px',
    height: '200px',
    paddingLeft: 0
  },
  image: {
    width: '300px',
    height: '100%'
  },
  '@keyframes fadeIn': {
    from: { opacity: 0 },
    to:   { opacity: 1 }
  }
}));

export default view(() => {
  const classes = useStyles({});

  return (
    <Paper
      className={classes.root}
      square
      elevation={4}
    >
      <Container className={classes.title}>
        <Skeleton width="25%" variant="text" />
        <Skeleton width="20%" variant="text" />
      </Container>
      <Container className={classes.body}>
        <div className={classes.imageOuter}>
          <Skeleton className={classes.image} variant="rect" />
        </div>
        <Container>
          <Skeleton variant="text" />
          <Skeleton width="80%" variant="text" />
        </Container>
      </Container>
    </Paper>
  );
});

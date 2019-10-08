import React from 'react';
import {
  Paper,
  Theme,
  withTheme,
  withWidth,
} from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    [theme.breakpoints.only('xs')]: {
      margin: theme.spacing(2),
    },
    [theme.breakpoints.between('sm', 'md')]: {
      margin: theme.spacing(3),
    },
    [theme.breakpoints.up('lg')]: {
      margin: theme.spacing(4),
      padding: theme.spacing(1),
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
    [theme.breakpoints.only('xs')]: {
      width: '100%',
    },
    [theme.breakpoints.up('sm')]: {
      width: '40%',
    },
  },
  author: {
    marginTop: 0,
    [theme.breakpoints.only('xs')]: {
      width: '70%',
    },
    [theme.breakpoints.up('sm')]: {
      width: '20%',
    },
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
    padding: theme.spacing(0, 2, 0, 2),
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
  },
  actions: {
    width: '300px',
  },
  markdownViewer: {
    paddingBottom: theme.spacing(1),
  },
  viewButton: {
    margin: theme.spacing(4, 2, 2, 0),
  },
}));

interface IModuleSkeletonProps {
  theme: Theme;
  width: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export default withTheme(withWidth()(({ theme, width: deviceWidth }: IModuleSkeletonProps): JSX.Element => {
  const classes = useStyles();

  return (
    <Paper
      className={classes.root}
      elevation={4}
    >
      <div className={classes.header}>
        <div className={classes.titleContainer}>
          <div className={classes.titleChip}>
            <Skeleton className={classes.title} height={24} />
          </div>
          <Skeleton className={classes.author} />
        </div>
        <Skeleton className={classes.viewButton} />
      </div>
      <div className={classes.body}>
        <div className={classes.markdownViewer}>
          {(() => {
            let short = false;

            return Array(Math.floor(Math.random() * 4 + 3)).fill(undefined).map((_, i) => i).map(n => {
              let width: string;

              const prob = deviceWidth === 'sm' ? 0.6 : 0.2;
              const minLine = deviceWidth === 'sm' ? 0 : 2;

              if (!short && Math.random() <= prob && n > minLine) {
                width = `calc(100vw - ${theme.spacing(2) * 2}px - ${Math.random() * 20 + 60}vw - 
                         ${deviceWidth === 'lg' || deviceWidth === 'xl' ? '241' : 0}px)`;
                short = true;
              } else {
                width = `calc(100vw - ${theme.spacing(2) * 2}px - ${Math.random() * 10 + 10}vw - 
                         ${deviceWidth === 'lg' || deviceWidth === 'xl' ? '241' : 0}px)`;
              }

              return <Skeleton key={n} style={{ width }} />;
            });
          })()}
        </div>
      </div>
    </Paper>
  );
}));

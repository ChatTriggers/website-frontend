import React from 'react';
import { Theme, Box } from '@material-ui/core';
import { makeStyles, createStyles } from '@material-ui/styles';
import Drawer from '~modules/Drawer';
import ModulePage from '~modules/ModulePage';

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    display: 'flex',
    minHeight: '100vh'
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    backgroundColor: theme.palette.background.default
  }
}));

export default () => {
const classes = useStyles();

  return (
    <div className={classes.root}>
      <Drawer />
      <Box className={classes.content}>
        <ModulePage />
      </Box>
    </div>
  );
};

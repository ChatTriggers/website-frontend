import React from 'react';
import { Theme, Box } from '@material-ui/core';
import { makeStyles, createStyles, useTheme } from '@material-ui/styles';
import Drawer from './Drawer';
import ModulePage from './ModulePage';

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    display: 'flex'
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3)
  }
}));

export default () => {
  const classes = useStyles();
  const theme = useTheme<Theme>();

  return (
    <div className={classes.root}>
      <Drawer />
      <Box className={classes.content} style={{ backgroundColor: theme.palette.background.default }}>
        <ModulePage />
      </Box>
    </div>
  );
};

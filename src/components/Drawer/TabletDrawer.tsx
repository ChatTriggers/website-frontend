import React from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  Typography,
  Theme
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { Menu as MenuIcon, ChevronLeft as ChevronLeftIcon } from '@material-ui/icons';
import clsx from 'clsx';
import DrawerContent from './DrawerContent';
import { drawerWidth } from '.';

const useStyles = makeStyles<Theme, { open: boolean }>(theme => ({
  appBar: {
    // transition: theme.transitions.create(['margin', 'width'], {
    //   easing: theme.transitions.easing.sharp,
    //   duration: theme.transitions.duration.leavingScreen
    // })
  },
  appBarShift: {
    width: props => `calc(100% - ${props.open ? drawerWidth : 0}px)`,
    marginLeft: props => props.open ? drawerWidth : 0,
    // transition: theme.transitions.create(['margin', 'width'], {
    //   easing: theme.transitions.easing.easeOut,
    //   duration: theme.transitions.duration.enteringScreen,
    // })
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  hide: {
    display: 'none'
  },
  drawer: {
    width: props => props.open ? drawerWidth : 0,
    flexShrink: 0
  },
  drawerPaper: {
    width: props => props.open ? drawerWidth : 0
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end'
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: props => props.open ? -drawerWidth : 0,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }
}));

export default () => {
  const [open, setOpen] = React.useState(false);
  const classes = useStyles({ open });

  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);

  return (
    <>
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, open && classes.appBarShift)}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, open && classes.hide)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            Tablet Drawer
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={open}
        classes={{
          paper: classes.drawerPaper
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <DrawerContent />
      </Drawer>
    </>
  );
};

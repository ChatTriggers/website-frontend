import {
  AppBar,
  IconButton,
  SwipeableDrawer,
  Theme,
  Toolbar,
  Typography,
} from '@material-ui/core';
import {
  ChevronLeft as ChevronLeftIcon,
  KeyboardArrowLeft as KeyboardArrowLeftIcon,
  Menu as MenuIcon,
} from '@material-ui/icons';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';

import { logoLong } from '~assets';

import DrawerContent from './DrawerContent';

const drawerWidth = 239;

const useStyles = makeStyles((theme: Theme) => ({
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  logo: {
    width: drawerWidth - 2,
  },
}));

interface IMobileDrawerProps extends RouteComponentProps {
  title: string;
}

export default withRouter(({ title, location, history }: IMobileDrawerProps) => {
  const classes = useStyles();
  const iOS = !!navigator.platform && /iPhone|iPad/.test(navigator.platform);
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = (): void => setOpen(true);
  const handleDrawerClose = (): void => setOpen(false);
  const onClickBack = (): void => {
    if (history.length === 1) history.push('/modules');
    else history.goBack();
  };

  const button =
    location.pathname === '/modules' ? (
      <IconButton
        onClick={handleDrawerOpen}
        edge="start"
        className={clsx(classes.menuButton, open && classes.hide)}
      >
        <MenuIcon />
      </IconButton>
    ) : (
      <IconButton edge="start" onClick={onClickBack}>
        <KeyboardArrowLeftIcon />
      </IconButton>
    );

  return (
    <>
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, open && classes.appBarShift)}
      >
        <Toolbar>
          {button}
          <Typography variant="h6" noWrap>
            {title}
          </Typography>
        </Toolbar>
      </AppBar>
      <SwipeableDrawer
        disableBackdropTransition={!iOS}
        disableDiscovery={iOS}
        className={classes.drawer}
        open={open}
        onOpen={handleDrawerOpen}
        onClose={handleDrawerClose}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <img className={classes.logo} src={logoLong} alt="ChatTriggers logo" />
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <DrawerContent closeDrawer={handleDrawerClose} />
      </SwipeableDrawer>
    </>
  );
});

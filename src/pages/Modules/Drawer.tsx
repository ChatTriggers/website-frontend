import React from 'react';
import clsx from 'clsx';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  Theme
} from '@material-ui/core';
import {
  List as IconList,
  Description as DescriptionIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  AccountCircle as AccountCircleIcon,
  Home as HomeIcon,
  Create as CreateIcon,
  ExitToApp as LoginIcon
} from '@material-ui/icons';
import { makeStyles, createStyles } from '@material-ui/styles';
import { view } from 'react-easy-state';
import { githubIcon, slate, logoLong } from '../../assets';
import { Auth } from '../../store';
import LoginDialog from './Dialogs/LoginDialog';
import CreateAccountDialog from './Dialogs/CreateAccountDialog';

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
      whiteSpace: 'nowrap'
    },
    drawerOpen: {
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    drawerClose: {
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      overflowX: 'hidden',
      width: theme.spacing(7) + 1,
      [theme.breakpoints.up('sm')]: {
        width: theme.spacing(9) + 1,
      },
    },
    toolbar: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 8px',
      ...theme.mixins.toolbar,
    },
    img: {
      maxWidth: 24,
      maxHeight: 24
    },
    logo: {
      maxWidth: '100%',
      maxHeight: '100%',
      objectFit: 'contain'
    }
  })
);

export default view(() => {
  const [open, setOpen] = React.useState(true);
  const [loggingIn, setLoggingIn] = React.useState(false);
  const [creatingAccount, setCreatingAccount] = React.useState(false);

  const classes = useStyles();

  const onDrawerChange = () => {
    setOpen(isOpen => !isOpen);
  };

  const onLoginClick = () => {
    setLoggingIn(true);
    setCreatingAccount(false);
  };

  const onLoginClose = () => {
    setLoggingIn(false);
  };

  const onCreateAccountClick = () => {
    setLoggingIn(false);
    setCreatingAccount(true);
  };

  const onCreateAccountClose = () => {
    setCreatingAccount(false);
  };

  return (
    <div className={classes.root}>
      <Drawer
        variant="permanent"
        open={open}
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open
          })
        }}
      >
        <div className={classes.toolbar}>
          {open && (
            <img
              className={classes.logo}
              src={logoLong}
              alt="slate icon"
            />
          )}
          <IconButton onClick={onDrawerChange}>
            {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </div>
        <List>
          <ListItem button>
            <ListItemIcon>
              <IconList color="primary" />
            </ListItemIcon>
            <ListItemText>
              All Modules
            </ListItemText>
          </ListItem>
        </List>
        <Divider />
        <List>
          <ListItem button href="https://www.chattriggers.com/slate/">
            <ListItemIcon>
              <img
                className={classes.img}
                src={slate}
                alt="slate icon"
              />
            </ListItemIcon>
            <ListItemText>
              Slate
            </ListItemText>
          </ListItem>
          <ListItem button href="https://www.chattriggers.com/javadocs/">
            <ListItemIcon>
              <DescriptionIcon />
            </ListItemIcon>
            <ListItemText>
              Javadocs
            </ListItemText>
          </ListItem>
          <ListItem button>
            <ListItemIcon>
              <img
                className={classes.img}
                src={githubIcon}
                alt="Github Octocat icon"
              />
            </ListItemIcon>
            <ListItemText>
              GitHub
            </ListItemText>
          </ListItem>
          <ListItem button>
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText>
              Home
            </ListItemText>
          </ListItem>
        </List>
        <Divider />
        <List>
          {Auth.isAuthed ? (
            <ListItem>
              <ListItemIcon>
                <AccountCircleIcon />
              </ListItemIcon>
              <ListItemText>
                {/* tslint:disable-next-line:no-non-null-assertion */}
                {Auth.store.user!.name}
              </ListItemText>
            </ListItem>
          ) : (
              <>
                <ListItem button onClick={onLoginClick}>
                  <ListItemIcon>
                    <LoginIcon />
                  </ListItemIcon>
                  <ListItemText>
                    Login
                </ListItemText>
                </ListItem>
                <ListItem button onClick={onCreateAccountClick}>
                  <ListItemIcon>
                    <CreateIcon />
                  </ListItemIcon>
                  <ListItemText>
                    Create Account
                </ListItemText>
                </ListItem>
                <LoginDialog open={loggingIn} close={onLoginClose} />
                <CreateAccountDialog open={creatingAccount} close={onCreateAccountClose} />
              </>
            )}
        </List>
      </Drawer>
    </div>
  );
});

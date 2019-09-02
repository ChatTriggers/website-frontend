import React from 'react';
import clsx from 'clsx';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Divider,
  Menu,
  MenuItem,
  Theme
} from '@material-ui/core';
import { ListItemProps } from '@material-ui/core/ListItem';
import {
  Description as DescriptionIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  AccountCircle as AccountCircleIcon,
  Home as HomeIcon,
  Create as CreateIcon,
  ExitToApp as LoginIcon,
  Settings as SettingsIcon
} from '@material-ui/icons';
import { makeStyles, createStyles } from '@material-ui/styles';
import { githubIcon, slate, logoLong } from '~assets';
import { authStore, observer } from '~store';
import LoginDialog from '~src/pages/ModulesPage/Dialogs/LoginDialog';
import CreateAccountDialog from '~src/pages/ModulesPage/Dialogs/CreateAccountDialog';
import { logout } from '~api';

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

const ListItemLink = (props: ListItemProps<'a', { button?: true }>) => (
  <ListItem button component="a" {...props} />
);

export default observer(() => {
  const [open, setOpen] = React.useState(true);
  const [loggingIn, setLoggingIn] = React.useState(false);
  const [creatingAccount, setCreatingAccount] = React.useState(false);
  const [settingsEl, setSettingsEl] = React.useState<SVGSVGElement | undefined>();

  const classes = useStyles();

  const handleSettingsClick = (e: React.MouseEvent<SVGSVGElement>) => {
    setSettingsEl(e.currentTarget);
  };

  const handleSettingsClose = () => {
    setSettingsEl(undefined);
  };

  const onLogout = async () => {
    await logout();
    handleSettingsClose();
  };

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
          <ListItemLink href="https://www.chattriggers.com/slate/">
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
          </ListItemLink>
          <ListItemLink href="https://www.chattriggers.com/javadocs/">
            <ListItemIcon>
              <DescriptionIcon />
            </ListItemIcon>
            <ListItemText>
              Javadocs
            </ListItemText>
          </ListItemLink>
          <ListItemLink href="https://github.com/ChatTriggers/ct.js">
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
          </ListItemLink>
          <ListItemLink href="#">
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText>
              Home
            </ListItemText>
          </ListItemLink>
        </List>
        <Divider />
        <List>
          {!!authStore.user ? (
            <ListItem>
              <ListItemIcon>
                <AccountCircleIcon />
              </ListItemIcon>
              <ListItemText>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignContent: 'center' }}>
                  {authStore.user.name}
                  <IconButton size="small">
                    <SettingsIcon onClick={handleSettingsClick} />
                  </IconButton>
                </div>
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
      <Menu
        anchorEl={settingsEl}
        open={!!settingsEl}
        onClose={handleSettingsClose}
      >
        <MenuItem onClick={onLogout}>Logout</MenuItem>
      </Menu>
    </div>
  );
});

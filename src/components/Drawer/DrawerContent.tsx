import React from 'react';
import {
  Divider,
  List,
  Menu,
  MenuItem,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Theme,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import {
  Description as DescriptionIcon,
  AccountCircle as AccountCircleIcon,
  Home as HomeIcon,
  Create as CreateIcon,
  ExitToApp as LoginIcon,
  Settings as SettingsIcon,
  Folder as FolderIcon,
} from '@material-ui/icons';
import { withRouter, Link } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';
import { githubIcon, menuBookIcon, discordIcon } from '~assets';
import { authStore, observer } from '~store';
import { logout } from '~api';

const useStyles = makeStyles((theme: Theme) => ({
  logo: {
    maxHeight: theme.mixins.toolbar.minHeight,
    objectFit: 'contain',
  },
  img: {
    maxWidth: 24,
    maxHeight: 24,
  },
}));

interface IDrawerContentProps extends RouteComponentProps<{}> {
  closeDrawer?(): void;
}

export default withRouter(observer(({ history, closeDrawer }: IDrawerContentProps) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(undefined as HTMLButtonElement | undefined);

  const onClickCreateAccount = (): void => {
    if (closeDrawer) closeDrawer();

    setTimeout(() => {
      history.push('/create-account');
    }, 300);
  };

  const onClickUserSettings = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
    setAnchorEl(e.currentTarget);
  };

  const onMenuClose = (): void => {
    setAnchorEl(undefined);
  };

  const onClickLogin = (): void => {
    if (closeDrawer) closeDrawer();

    setTimeout(() => {
      history.push('/login');
    }, 300);
  };

  const onClickLogout = async (): Promise<void> => {
    await logout();
    onMenuClose();
  };

  return (
    <>
      <Divider />
      <List>
        <ListItem button component="a" href="https://www.chattriggers.com/home/">
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText>
            Home
          </ListItemText>
        </ListItem>
        <ListItem button component={Link} to="/">
          <ListItemIcon>
            <FolderIcon />
          </ListItemIcon>
          <ListItemText>
            All Modules
          </ListItemText>
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem button component="a" href="https://www.chattriggers.com/slate/">
          <ListItemIcon>
            <img
              className={classes.img}
              src={menuBookIcon}
              alt="slate icon"
            />
          </ListItemIcon>
          <ListItemText>
            Slate
          </ListItemText>
        </ListItem>
        <ListItem button component="a" href="https://www.chattriggers.com/javadocs/">
          <ListItemIcon>
            <DescriptionIcon />
          </ListItemIcon>
          <ListItemText>
            Javadocs
          </ListItemText>
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem button component="a" href="https://discordapp.com/invite/0fNjZyopOvBHZyG8">
          <ListItemIcon>
            <img
              className={classes.img}
              src={discordIcon}
              alt="Discord Logo"
            />
          </ListItemIcon>
          <ListItemText>
            Discord
          </ListItemText>
        </ListItem>
        <ListItem button component="a" href="https://github.com/ChatTriggers/ct.js">
          <ListItemIcon>
            <img
              className={classes.img}
              src={githubIcon}
              alt="Github Octocat Logo"
            />
          </ListItemIcon>
          <ListItemText>
            GitHub
          </ListItemText>
        </ListItem>
      </List>
      <Divider />
      <List>
        {authStore.user ? (
          <ListItem>
            <ListItemIcon>
              <AccountCircleIcon />
            </ListItemIcon>
            <ListItemText>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignContent: 'center' }}>
                {authStore.user.name}
                <IconButton size="small" onClick={onClickUserSettings}>
                  <SettingsIcon />
                </IconButton>
              </div>
            </ListItemText>
          </ListItem>
        ) : (
          <>
            <ListItem button onClick={onClickLogin}>
              <ListItemIcon>
                <LoginIcon />
              </ListItemIcon>
              <ListItemText>
                  Login
              </ListItemText>
            </ListItem>
            <ListItem button onClick={onClickCreateAccount}>
              <ListItemIcon>
                <CreateIcon />
              </ListItemIcon>
              <ListItemText>
                  Create Account
              </ListItemText>
            </ListItem>
          </>
        )}
      </List>
      <Menu
        id="account-menu"
        anchorEl={anchorEl}
        keepMounted
        open={!!anchorEl}
        onClose={onMenuClose}
      >
        <MenuItem onClick={onClickLogout}>Logout</MenuItem>
      </Menu>
    </>
  );
}));

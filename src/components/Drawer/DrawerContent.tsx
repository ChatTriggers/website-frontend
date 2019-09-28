import React from 'react';
import {
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import {
  Description as DescriptionIcon,
  AccountCircle as AccountCircleIcon,
  Home as HomeIcon,
  Create as CreateIcon,
  ExitToApp as LoginIcon,
  Settings as SettingsIcon,
} from '@material-ui/icons';
import { githubIcon, slate } from '~assets';
import { authStore, observer } from '~store';

const useStyles = makeStyles({
  img: {
    maxWidth: 24,
    maxHeight: 24,
  },
});

export default observer(() => {
  const classes = useStyles();

  return (
    <>
      <Divider />
      <List>
        <ListItem button component="a" href="https://www.chattriggers.com/slate/">
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
        <ListItem button component="a" href="https://www.chattriggers.com/javadocs/">
          <ListItemIcon>
            <DescriptionIcon />
          </ListItemIcon>
          <ListItemText>
            Javadocs
          </ListItemText>
        </ListItem>
        <ListItem button component="a" href="https://github.com/ChatTriggers/ct.js">
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
        <ListItem button component="a" href="#">
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
        {authStore.user ? (
          <ListItem>
            <ListItemIcon>
              <AccountCircleIcon />
            </ListItemIcon>
            <ListItemText>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignContent: 'center' }}>
                {authStore.user.name}
                <IconButton size="small">
                  <SettingsIcon />
                </IconButton>
              </div>
            </ListItemText>
          </ListItem>
        ) : (
          <>
            <ListItem button>
              <ListItemIcon>
                <LoginIcon />
              </ListItemIcon>
              <ListItemText>
                  Login
              </ListItemText>
            </ListItem>
            <ListItem button>
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
    </>
  );
});

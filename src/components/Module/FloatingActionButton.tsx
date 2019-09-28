import React from 'react';
import { Fab, Tooltip, Theme } from '@material-ui/core';
import {
  Add as AddIcon,
  ArrowUpward as ArrowUpwardIcon,
} from '@material-ui/icons';
import { makeStyles } from '@material-ui/styles';
import { animateScroll as scroll } from 'react-scroll';
import { NotDesktop, Desktop } from '~components';
import { authStore, observer } from '~store';

const useStyles = makeStyles((theme: Theme) => ({
  fab: {
    position: 'fixed',
    right: theme.spacing(4),
    bottom: theme.spacing(4),
  },
}));

const FabDesktopButton = (): JSX.Element => {
  const classes = useStyles();

  const onFabClick = (): void => {
    //
  };

  return (
    <Tooltip title="Create Module" placement="left">
      <Fab className={classes.fab} color="primary" onClick={onFabClick}>
        <AddIcon />
      </Fab>
    </Tooltip>
  );
};

const FabMobileButton = (): JSX.Element => {
  const classes = useStyles();

  return (
    <Fab className={classes.fab} color="primary" onClick={scroll.scrollToTop}>
      <ArrowUpwardIcon />
    </Fab>
  );
};

/**
 * On desktop, this button should open the upload module page.
 * On mobile and tablets, this button will be a way to quickly
 * return to the top of the webpage
 */
export default observer(() => (
  <>
    {authStore.isAuthed && (
      <Desktop>
        <FabDesktopButton />
      </Desktop>
    )}
    <NotDesktop>
      <FabMobileButton />
    </NotDesktop>
  </>
));

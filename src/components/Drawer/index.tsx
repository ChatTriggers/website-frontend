import React from 'react';
import { Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import MobileDrawer from './MobileDrawer';
import DesktopDrawer from './DesktopDrawer';
import { NotDesktop, Desktop } from '~components/utils/DeviceUtils';
import { globalStore, observer } from '~store';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex',
  },
  content: {
    [theme.breakpoints.only('xs')]: {
      marginTop: 56,
      minHeight: 'calc(100vh - 56px)',
    },
    [theme.breakpoints.between('sm', 'md')]: {
      marginTop: 64,
      minHeight: 'calc(100vh - 64px)',
    },
    [theme.breakpoints.up('lg')]: {
      marginTop: 64,
      width: 'calc(100vw - 240px)',
      minHeight: 'calc(100vh - 64px)',
    },
    flexGrow: 1,
    background: theme.palette.background.default,
  },
}));

interface IDrawerProps {
  children: React.ReactChild | React.ReactChild[];
}

export default observer(({ children }: IDrawerProps): JSX.Element => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <nav style={{ zIndex: 2 }}>
        <NotDesktop>
          <MobileDrawer title={globalStore.drawerTitle} />
        </NotDesktop>
        <Desktop>
          <DesktopDrawer title={globalStore.drawerTitle} />
        </Desktop>
      </nav>
      <main className={classes.content}>
        {children}
      </main>
    </div>
  );
});

import React from 'react';
import { Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import MobileDrawer from './MobileDrawer';
import TabletDrawer from './TabletDrawer';
import DesktopDrawer from './DesktopDrawer';
import { Mobile, Tablet, Desktop } from '~components/utils/DeviceUtils';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex',
  },
  content: {
    [theme.breakpoints.only('xs')]: {
      marginTop: 56,
    },
    [theme.breakpoints.between('sm', 'md')]: {
      marginTop: 64,
    },
    flexGrow: 1,
    background: theme.palette.background.default,
  },
}));

interface IDrawerProps {
  title: string;
  button?: React.ReactChild;
  children: React.ReactChild | React.ReactChild[];
}

export default (props: IDrawerProps): JSX.Element => {
  const classes = useStyles();

  const { title, button, children } = props;

  return (
    <div className={classes.root}>
      <nav style={{ zIndex: 2 }}>
        <Mobile>
          <MobileDrawer title={title} button={button} />
        </Mobile>
        <Tablet>
          <TabletDrawer />
        </Tablet>
        <Desktop>
          <DesktopDrawer />
        </Desktop>
      </nav>
      <main className={classes.content}>
        {children}
      </main>
    </div>
  );
};

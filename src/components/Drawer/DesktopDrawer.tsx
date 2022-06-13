import { AppBar, Drawer, Theme, Toolbar, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import { logoLong } from '~assets';

import DrawerContent from './DrawerContent';

const drawerWidth = 239;

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(3),
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

interface IDesktopDrawerProps {
  title: string;
}

export default ({ title }: IDesktopDrawerProps) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6" noWrap>
            {title}
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
        anchor="left"
      >
        <div className={classes.drawerHeader}>
          <img className={classes.logo} src={logoLong} alt="ChatTriggers logo" />
        </div>
        <DrawerContent />
      </Drawer>
    </div>
  );
};

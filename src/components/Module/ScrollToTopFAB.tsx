import { Fab, Theme } from '@material-ui/core';
import { ArrowUpward as ArrowUpwardIcon } from '@material-ui/icons';
import { makeStyles } from '@material-ui/styles';
import { animateScroll as scroll } from 'react-scroll';

const useStyles = makeStyles((theme: Theme) => ({
  fab: {
    position: 'fixed',
    right: theme.spacing(4),
    top: theme.spacing(4) + 64,
  },
}));

export default () => {
  const classes = useStyles();

  return (
    <Fab className={classes.fab} color="primary" onClick={scroll.scrollToTop}>
      <ArrowUpwardIcon />
    </Fab>
  );
};

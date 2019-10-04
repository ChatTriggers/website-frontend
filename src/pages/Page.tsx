import React from 'react';
import { Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

interface IPageProps {
  slideIn: 'left' | 'right';
  slideOut: 'left' | 'right';
  children: React.ReactChild;
}

const useStyles = makeStyles<Theme, IPageProps>((theme: Theme) => ({
  '@keyframes slideInLeft': {
    from: {
      transform: 'translate3d(-100%, 0, 0)',
      visibility: 'visible',
    },
    to: {
      translate: 'translate3d(0, 0, 0)',
    },
  },
  '@keyframes slideInRight': {
    from: {
      transform: 'translate3d(100%, 0, 0)',
      visibility: 'visible',
    },
    to: {
      translate: 'translate3d(0, 0, 0)',
    },
  },
  '@keyframes slideOutLeft': {
    from: {
      transform: 'translate3d(0, 0, 0)',
    },
    to: {
      visibility: 'hidden',
      transform: 'translate3d(-100%, 0, 0)',
    },
  },
  '@keyframes slideOutRight': {
    from: {
      transform: 'translate3d(0, 0, 0)',
    },
    to: {
      visibility: 'hidden',
      transform: 'translate3d(100%, 0, 0)',
    },
  },
  root: {
    '&.page-enter': {
      animation: (props): string => `${props.slideIn === 'left' ? 'slideInLeft' : 'slideInRight'} 0.2s forwards`,
    },
    '&.page-exit': {
      animation: (props): string => `${props.slideOut === 'left' ? 'slideOutLeft' : 'slideOutRight'} 0.2s forwards`,
    },
    backgroundColor: theme.palette.background.default,
  },
}));

export default (props: IPageProps): JSX.Element => {
  const classes = useStyles(props);
  const { children } = props;

  return (
    <div className={classes.root}>
      {children}
    </div>
  );
};

import { Theme, useMediaQuery } from '@material-ui/core';
import { Breakpoint } from '@material-ui/core/styles/createBreakpoints';

interface IProps {
  children: JSX.Element | JSX.Element[];
}

enum BreakpointDirection {
  Up,
  Down,
}

const makeDevice = (breakpoint: Breakpoint, direction: BreakpointDirection) => {
  return ({ children }: IProps) => {
    let hidden;
    if (direction === BreakpointDirection.Up) {
      hidden = useMediaQuery<Theme>(theme => theme.breakpoints.up(breakpoint));
    } else {
      hidden = useMediaQuery<Theme>(theme => theme.breakpoints.down(breakpoint));
    }
    if (hidden) return null;
    if (children instanceof Array) {
      return <>{children}</>;
    }

    return children;
  };
};

export const Mobile = makeDevice('sm', BreakpointDirection.Up);
export const Tablet = makeDevice('lg', BreakpointDirection.Up);
export const Desktop = makeDevice('md', BreakpointDirection.Down);
export const NotDesktop = makeDevice('lg', BreakpointDirection.Up);
export const NotMobile = makeDevice('xs', BreakpointDirection.Down);

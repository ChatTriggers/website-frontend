import React from 'react';
import { Hidden } from '@material-ui/core';

interface IProps {
  children: React.ReactChild | React.ReactChild[];
}

/*
<Hidden smUp>
  <MobileDrawer />
</Hidden>
<Hidden xsDown lgUp>
  <TabletDrawer />
</Hidden>
<Hidden mdDown>
  <DesktopDrawer />
</Hidden>
*/

export const Mobile = ({ children }: IProps): JSX.Element => <Hidden smUp>{children}</Hidden>;
export const Tablet = ({ children }: IProps): JSX.Element => <Hidden xsDown lgUp>{children}</Hidden>;
export const Desktop = ({ children }: IProps): JSX.Element => <Hidden mdDown>{children}</Hidden>;
export const NotDesktop = ({ children }: IProps): JSX.Element => <Hidden lgUp>{children}</Hidden>;

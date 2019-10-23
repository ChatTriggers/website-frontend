import React from 'react';
import { Hidden } from '@material-ui/core';

interface IProps {
  children: React.ReactChild | React.ReactChild[];
}

export const Mobile = ({ children }: IProps): JSX.Element => <Hidden smUp>{children}</Hidden>;
export const Tablet = ({ children }: IProps): JSX.Element => <Hidden xsDown lgUp>{children}</Hidden>;
export const Desktop = ({ children }: IProps): JSX.Element => <Hidden mdDown>{children}</Hidden>;
export const NotDesktop = ({ children }: IProps): JSX.Element => <Hidden lgUp>{children}</Hidden>;
export const NotMobile = ({ children }: IProps): JSX.Element => <Hidden xsDown>{children}</Hidden>;

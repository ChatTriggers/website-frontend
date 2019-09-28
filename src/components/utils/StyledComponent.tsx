import React from 'react';
import { Theme } from '@material-ui/core';
import { StyleRulesCallback } from '@material-ui/styles/withStyles';

export type Styles = StyleRulesCallback<Theme, object>;

type Classes<S extends Styles> = {
  [K in keyof ReturnType<S>]: string;
}

export default class <S extends Styles, Props = {}> extends React.Component<Props> {
  public get classes(): Classes<S> {
    return (this.props as unknown as {
      classes: Classes<S>;
    }).classes;
  }
}

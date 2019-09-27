import React from 'react';
import { Theme } from '@material-ui/core';
import { StyleRulesCallback } from '@material-ui/styles/withStyles';

export type Styles = StyleRulesCallback<Theme, object>;

export default class <S extends Styles, Props = {}> extends React.Component<Props> {
  public get classes() {
    return (this.props as unknown as {
      classes: {
        [K in keyof ReturnType<S>]: string;
      }
    }).classes;
  }
}

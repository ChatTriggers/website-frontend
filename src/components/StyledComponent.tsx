import React from 'react';
import { Theme } from '@material-ui/core';
import { StyleRulesCallback } from '@material-ui/styles/withStyles';

export default class <Styles extends StyleRulesCallback<Theme, object>, Props = {}> extends React.Component<Props> {
  protected get classes() {
    return (this.props as unknown as {
      classes: {
        [K in keyof ReturnType<Styles>]: string;
      }
    }).classes;
  }
}

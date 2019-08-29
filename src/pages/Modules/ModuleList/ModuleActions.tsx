import React from 'react';
import clsx from 'clsx';
import { ButtonGroup, Button, Theme } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { authStore } from '~store';

const styles = (theme: Theme) => ({
  root: {
    width: '100%'
  },
  button: {
    marginBottom: 10
  },
  buttonEdit: {
    backgroundColor: '#ffeb3b'
  },
  buttonDelete: {
    backgroundColor: theme.palette.error.main,
    color: theme.palette.error.contrastText
  }
});

interface IModuleActionsProps {
  className?: string;
  authed: boolean;
}

class ModuleActions extends React.Component<IModuleActionsProps> {
  private get classes() {
    return (this.props as unknown as {
      classes: {
        [K in keyof ReturnType<typeof styles>]: string;
      }
    }).classes;
  }

  public render() {
    return (
      <div className={this.props.className}>
        <Button
          className={this.classes.button}
          fullWidth 
          size="small"
          variant="contained"
        >
          View Releases
        </Button>
        {this.props.authed && (
          <>
            <Button 
              className={clsx(this.classes.button, this.classes.buttonEdit)} 
              fullWidth 
              size="small"
              variant="contained"
            >Edit Module
            </Button>
            <Button 
              className={clsx(this.classes.button, this.classes.buttonDelete)} 
              fullWidth 
              size="small"
              variant="contained"
            >Delete Module
            </Button>
          </>
        )}
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(ModuleActions);

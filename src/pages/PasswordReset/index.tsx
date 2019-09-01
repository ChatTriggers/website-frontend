import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Paper, Typography, TextField, ButtonGroup, Button, Theme, CircularProgress } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { StyleRulesCallback } from '@material-ui/styles/withStyles';
import { observer, observable, action, computed } from '~store';
import { History } from 'history';
import { StaticContext } from 'react-router';
import { requestPasswordComplete } from '~api';
import qs from 'querystring';
import { StyledComponent } from '~components';

// tslint:disable-next-line:no-any
const styles: StyleRulesCallback<any, any> = (theme: Theme) => ({
  rootOuter: {
    display: 'flex',
    minHeight: '100vh',
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'center',
    backgroundColor: theme.palette.background.default
  },
  rootInner: {
    // flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    alignContent: 'center',
    justifyContent: 'center'
  },
  content: {
    padding: theme.spacing(3),
  },
  buttons: {
    marginTop: theme.spacing(4)
  },
  buttonError: {
    backgroundColor: theme.palette.error.main
  }
});

// tslint:disable-next-line:no-any
interface IPasswordResetPage extends RouteComponentProps<any, StaticContext, any> { }

@observer
class PasswordResetPage extends StyledComponent<typeof styles, IPasswordResetPage> {
  @observable
  private password = '';

  @observable
  private passwordConfirmation = '';

  @observable
  private loading = false;

  @computed
  get isEqual() {
    return this.password === this.passwordConfirmation;
  }

  @computed
  get isValid() {
    return this.password.length >= 8;
  }

  @action
  private readonly onChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.password = e.target.value;
  }

  @action
  private readonly onChangePasswordConfirmation = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.passwordConfirmation = e.target.value;
  }

  private readonly onCancel = () => {
    this.props.history.push('/');
  }

  private readonly onReset = async () => {
    action(() => { this.loading = true; })();
    const query = qs.parse(this.props.location.search) as {
      token: string
    };
    await requestPasswordComplete(this.password, query.token);
    action(() => { this.loading = false; })();
  }

  public render() {
    return (
      <div className={this.classes.rootOuter}>
        <div className={this.classes.rootInner}>
          <Paper
            className={this.classes.content}
            elevation={4}
            square
          >
            <Typography variant="h5">
              Reset Password
            </Typography>
            <TextField
              label="Password"
              type="password"
              value={this.password}
              onChange={this.onChangePassword}
              error={!this.isValid}
              helperText={(!this.isValid && 'Password must be longer than 8 characters') || ''}
              fullWidth
            />
            <TextField
              label="Password Confirmation"
              type="password"
              value={this.passwordConfirmation}
              onChange={this.onChangePasswordConfirmation}
              error={!this.isEqual}
              helperText={(!this.isEqual && 'Must match password field above') || ''}
              fullWidth
            />
            <div style={{ display: 'flex', justifyContent: 'end' }}>
              <ButtonGroup className={this.classes.buttons}>
                <Button onClick={this.onCancel}>Cancel</Button>
                <Button onClick={this.onReset} className={this.classes.buttonError}>
                  {this.loading ? <CircularProgress size={30} /> : 'Reset Password'}
                </Button>
              </ButtonGroup>
            </div>
          </Paper>
        </div>
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(withRouter(PasswordResetPage));

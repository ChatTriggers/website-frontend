import qs from 'querystring';
import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import {
  Paper,
  Typography,
  TextField,
  ButtonGroup,
  Button,
  Theme,
  CircularProgress,
} from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { StyleRulesCallback } from '@material-ui/styles/withStyles';
import MetaTags from 'react-meta-tags';
import {
  observer,
  observable,
  action,
  runInAction,
  computed,
} from '~store';
import { requestPasswordComplete } from '~api';
import { StyledComponent } from '~components';

const styles: StyleRulesCallback<Theme, object> = (theme: Theme) => ({
  rootOuter: {
    display: 'flex',
    minHeight: '100vh',
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'center',
    backgroundColor: theme.palette.background.default,
  },
  rootInner: {
    // flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    alignContent: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: theme.spacing(3),
  },
  buttons: {
    marginTop: theme.spacing(4),
  },
  buttonError: {
    backgroundColor: theme.palette.error.main,
  },
});

@observer
class PasswordResetPage extends StyledComponent<typeof styles, RouteComponentProps> {
  @observable
  private password = '';

  @observable
  private passwordConfirmation = '';

  @observable
  private loading = false;

  @computed
  get isEqual(): boolean {
    return this.password === this.passwordConfirmation;
  }

  @computed
  get isValid(): boolean {
    return this.password.length >= 8;
  }

  @action
  private readonly onChangePassword = (e: React.ChangeEvent<HTMLInputElement>): void => {
    this.password = e.target.value;
  }

  @action
  private readonly onChangePasswordConfirmation = (e: React.ChangeEvent<HTMLInputElement>): void => {
    this.passwordConfirmation = e.target.value;
  }

  private readonly onCancel = (): void => {
    this.props.history.push('/');
  }

  private readonly onReset = async (): Promise<void> => {
    runInAction(() => { this.loading = true; });
    const query = qs.parse(this.props.location.search) as {
      token: string;
    };
    await requestPasswordComplete(this.password, query.token);
    runInAction(() => { this.loading = false; });
  }

  private readonly handlerKeyDown = action(({ key }: React.KeyboardEvent<HTMLInputElement>) => {
    if (key === 'Enter') {
      if (this.password.length > 7 && this.passwordConfirmation.length > 7) {
        this.onReset();
      }
    }
  });

  public render(): JSX.Element {
    return (
      <div className={this.classes.rootOuter}>
        <MetaTags>
          <title>Password Reset</title>
          <meta property="og:title" content="Password Reset" />
          <meta property="og:description" content="Reset your ctjs website password" />
          <meta property="og:url" content="https://www.chattriggers.com/passwordreset" />
        </MetaTags>
        <div className={this.classes.rootInner}>
          <Paper className={this.classes.content} square>
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
              onKeyDownCapture={this.handlerKeyDown}
            />
            <TextField
              label="Password Confirmation"
              type="password"
              value={this.passwordConfirmation}
              onChange={this.onChangePasswordConfirmation}
              error={!this.isEqual}
              helperText={(!this.isEqual && 'Must match password field above') || ''}
              fullWidth
              onKeyDownCapture={this.handlerKeyDown}
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

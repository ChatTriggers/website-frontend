import {
  Button,
  ButtonGroup,
  CircularProgress,
  Paper,
  TextField,
  Theme,
  Typography,
} from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { StyleRulesCallback, WithStyles } from '@material-ui/styles/withStyles';
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { RouteComponentProps, withRouter } from 'react-router-dom';

import { requestPasswordComplete } from '~api';
import { action, computed, observer, runInAction } from '~store';

const styles: StyleRulesCallback<Theme, Record<string, unknown>> = (theme: Theme) => ({
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

type IPasswordResetPageProps = RouteComponentProps & WithStyles<typeof styles>;

const PasswordResetPage = observer(
  ({ location, classes, history }: IPasswordResetPageProps) => {
    const [emailTyped, setEmailTyped] = React.useState(false);
    const [passwordTyped, setPasswordTyped] = React.useState(false);
    const [passwordConfirmTyped, setPasswordConfirmTyped] = React.useState(false);
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [passwordConfirmation, setPasswordConfirmation] = React.useState('');
    const [loading, setLoading] = React.useState(false);

    const emailIsValid = computed(
      () => email.length > 0 && email.includes('@') && email.indexOf('@') < email.length,
    );

    const passwordIsValid = computed(() => password.length >= 8);

    const passwordConfirmIsValid = computed(() => password === passwordConfirmation);

    const allValid = computed(
      () => emailIsValid && passwordIsValid && passwordConfirmIsValid,
    );

    const onChangeEmail = action((e: React.ChangeEvent<HTMLInputElement>) => {
      setEmailTyped(true);
      setEmail(e.target.value);
    });

    const onChangePassword = action((e: React.ChangeEvent<HTMLInputElement>) => {
      setPasswordTyped(true);
      setPassword(e.target.value);
    });

    const onChangePasswordConfirmation = action(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        setPasswordConfirmTyped(true);
        setPasswordConfirmation(e.target.value);
      },
    );

    const onCancel = (): void => {
      history.push('/');
    };

    const onReset = async (): Promise<void> => {
      runInAction(() => {
        setLoading(true);
      });
      const query = new URLSearchParams(location.search);
      const token = query.get('token');
      if (!token) return;
      await requestPasswordComplete(password, token);
      runInAction(() => {
        setLoading(false);
      });
    };

    const handlerKeyDown = action(({ key }: React.KeyboardEvent<HTMLInputElement>) => {
      if (key === 'Enter' && password.length > 7 && passwordConfirmation.length > 7) {
        onReset();
      }
    });

    return (
      <div className={classes.rootOuter}>
        <Helmet>
          <title>Password Reset</title>
          <meta property="og:title" content="Password Reset" />
          <meta property="og:description" content="Reset your ctjs website password" />
          <meta property="og:url" content="https://www.chattriggers.com/passwordreset" />
        </Helmet>
        <div className={classes.rootInner}>
          <Paper className={classes.content} square>
            <Typography variant="h5">Reset Password</Typography>
            <TextField
              style={{ marginTop: 20 }}
              label="Email"
              type="email"
              value={email}
              onChange={onChangeEmail}
              error={!emailIsValid && emailTyped}
              helperText={
                (!emailIsValid &&
                  "Email must be non-empty and contain an '@' character") ||
                ''
              }
              fullWidth
              onKeyDownCapture={handlerKeyDown}
            />
            <TextField
              style={{ marginTop: 20 }}
              label="Password"
              type="password"
              value={password}
              onChange={onChangePassword}
              error={!passwordIsValid && passwordTyped}
              helperText={
                (!passwordIsValid && 'Password must be longer than 8 characters') || ''
              }
              fullWidth
              onKeyDownCapture={handlerKeyDown}
            />
            <TextField
              style={{ marginTop: 20 }}
              label="Password Confirmation"
              type="password"
              value={passwordConfirmation}
              onChange={onChangePasswordConfirmation}
              error={!passwordConfirmIsValid && passwordConfirmTyped}
              helperText={
                (!passwordConfirmIsValid && 'Must match password field above') || ''
              }
              fullWidth
              onKeyDownCapture={handlerKeyDown}
            />
            <div style={{ display: 'flex', justifyContent: 'end' }}>
              <ButtonGroup className={classes.buttons}>
                <Button onClick={onCancel}>Cancel</Button>
                <Button
                  onClick={onReset}
                  className={classes.buttonError}
                  disabled={!allValid}
                >
                  {loading ? <CircularProgress size={30} /> : 'Reset Password'}
                </Button>
              </ButtonGroup>
            </div>
          </Paper>
        </div>
      </div>
    );
  },
);

export default withStyles(styles, { withTheme: true })(withRouter(PasswordResetPage));

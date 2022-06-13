import {
  Button,
  CircularProgress,
  Paper,
  TextField,
  Theme,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { History } from 'history';
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { withRouter } from 'react-router-dom';

import { login } from '~api';
import { action } from '~store';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    [theme.breakpoints.down('md')]: {
      width: '100vw',
      height: 'calc(100vh - 56px)',
    },
    [theme.breakpoints.up('lg')]: {
      width: '100%',
      height: 'calc(100vh - 64px)',
    },
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center',
  },
  paperContainer: {
    margin: 'auto',
    width: '100%',
    [theme.breakpoints.only('xs')]: {
      maxWidth: 320,
    },
    [theme.breakpoints.up('sm')]: {
      maxWidth: 600,
    },
  },
  paper: {
    margin: theme.spacing(2),
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    color: theme.palette.error.main,
  },
  username: {
    width: '100%',
  },
  password: {
    width: '100%',
    marginTop: theme.spacing(2),
  },
  button: {
    marginTop: theme.spacing(2),
  },
}));

interface ILoginPageProps {
  history: History;
}

export default withRouter(({ history }: ILoginPageProps) => {
  const classes = useStyles();

  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(false);

  const onChangeUsername = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ): void => {
    setUsername(e.target.value);
  };

  const onChangePassword = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ): void => {
    setPassword(e.target.value);
  };

  const onSubmit = async (): Promise<void> => {
    try {
      setLoading(true);
      await login(username, password);
      setLoading(false);
      setError(false);

      if (history.length === 1) history.push('/modules');
      else history.goBack();
    } catch (e) {
      setError(true);
    }
  };

  const handlerKeyDown = action(({ key }: React.KeyboardEvent<HTMLInputElement>) => {
    if (key === 'Enter') {
      if (username.length > 0 && password.length > 0) {
        onSubmit();
      }
    }
  });

  const forgotPassword = (): void => {
    history.push('/passwordreset');
  };

  return (
    <div className={classes.root}>
      <Helmet>
        <title>Login</title>
        <meta property="og:title" content="Login" />
        <meta property="og:description" content="Login to the ctjs website" />
        <meta property="og:url" content="https://www.chattriggers.com/login" />
      </Helmet>
      <div className={classes.paperContainer}>
        <Paper className={classes.paper} square>
          <TextField
            className={classes.username}
            required
            id="login-username-field"
            label="Username"
            type="text"
            value={username}
            onChange={onChangeUsername}
            autoComplete="username"
            onKeyDownCapture={handlerKeyDown}
            autoFocus
          />
          <TextField
            className={classes.password}
            required
            id="login-password-field"
            label="Password"
            type="password"
            value={password}
            onChange={onChangePassword}
            autoComplete="current-password"
            onKeyDownCapture={handlerKeyDown}
          />
          <div style={{ width: '102.5%', marginTop: 5 }}>
            <Button onClick={forgotPassword}>
              <Typography variant="body2">Forgot Password?</Typography>
            </Button>
          </div>
          {error && (
            <Typography className={classes.error} variant="caption">
              Unrecognized username and password
            </Typography>
          )}
          <Button
            className={classes.button}
            variant="contained"
            onClick={onSubmit}
            color="primary"
            disabled={username === '' || password === ''}
          >
            {loading && !error ? (
              <CircularProgress color="secondary" size={30} />
            ) : (
              'Login'
            )}
          </Button>
        </Paper>
      </div>
    </div>
  );
});

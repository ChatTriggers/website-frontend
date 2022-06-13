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

import { createUser } from '~api';
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

interface ICreateAccountPageProps {
  history: History;
}

export default withRouter(({ history }: ICreateAccountPageProps) => {
  const classes = useStyles();

  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [email, setEmail] = React.useState('');
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

  const onChangeEmail = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ): void => {
    setEmail(e.target.value);
  };

  const onSubmit = async (): Promise<void> => {
    try {
      setError(false);
      setLoading(true);
      await createUser(username, password, email);
      setLoading(false);

      if (history.length === 1) history.push('/modules');
      else history.goBack();
    } catch (e) {
      setError(true);
    }
  };

  const handlerKeyDown = action(({ key }: React.KeyboardEvent<HTMLInputElement>) => {
    if (key === 'Enter') {
      if (username.length > 0 && password.length > 0 && email.length > 0) {
        onSubmit();
      }
    }
  });

  return (
    <div className={classes.root}>
      <Helmet>
        <title>Create Account</title>
        <meta property="og:title" content="Create Account" />
        <meta property="og:description" content="Create a new ctjs account" />
        <meta property="og:url" content="https://www.chattriggers.com/create-account" />
      </Helmet>
      <div className={classes.paperContainer}>
        <Paper className={classes.paper} square>
          <TextField
            className={classes.username}
            required
            id="create-account-username-field"
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
            id="create-account-email-field"
            label="Email"
            type="text"
            value={email}
            onChange={onChangeEmail}
            autoComplete="email"
            onKeyDownCapture={handlerKeyDown}
          />
          <TextField
            className={classes.password}
            required
            id="create-account-password-field"
            label="Password"
            type="password"
            value={password}
            onChange={onChangePassword}
            autoComplete="new-password"
            onKeyDownCapture={handlerKeyDown}
          />
          {error && (
            <Typography className={classes.error} variant="caption">
              Error creating account. Please try again later.
            </Typography>
          )}
          <Button
            className={classes.button}
            variant="contained"
            onClick={onSubmit}
            color="primary"
            disabled={username === '' || password === '' || email === ''}
          >
            {loading && !error ? (
              <CircularProgress color="secondary" size={30} />
            ) : (
              'Create Account'
            )}
          </Button>
        </Paper>
      </div>
    </div>
  );
});

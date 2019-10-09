import React from 'react';
import {
  Paper,
  TextField,
  Button,
  CircularProgress,
  Theme,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { withRouter } from 'react-router-dom';
import { History } from 'history';
import { login } from '~api';

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

export default withRouter(({ history }: ILoginPageProps): JSX.Element => {
  const classes = useStyles();

  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(false);

  const onChangeUsername = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>): void => {
    setUsername(e.target.value);
  };

  const onChangePassword = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>): void => {
    setPassword(e.target.value);
  };

  const onSubmit = async (): Promise<void> => {
    try {
      setLoading(true);
      await login(username, password);
      setLoading(false);
      setError(false);
      history.goBack(); // TODO: Provide feedback that login actually worked
    } catch (e) {
      setError(true);
    }
  };

  return (
    <div className={classes.root}>
      <div className={classes.paperContainer}>
        <Paper
          className={classes.paper}
          elevation={4}
        >
          <TextField
            className={classes.username}
            required
            id="login-username-field"
            label="Username"
            type="text"
            value={username}
            onChange={onChangeUsername}
            autoComplete="username"
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
          />
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
            {loading && !error ? <CircularProgress color="secondary" size={30} /> : 'Login'}
          </Button>
        </Paper>
      </div>
    </div>
  );
});

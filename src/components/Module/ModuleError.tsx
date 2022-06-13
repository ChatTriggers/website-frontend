import { Container, Paper, Theme, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    [theme.breakpoints.only('xs')]: {
      margin: theme.spacing(2),
      padding: theme.spacing(2),
    },
    [theme.breakpoints.between('sm', 'md')]: {
      margin: theme.spacing(3),
      padding: theme.spacing(3),
    },
    [theme.breakpoints.up('lg')]: {
      margin: theme.spacing(2, 4),
      padding: theme.spacing(4),
    },
  },
  body: {
    marginTop: theme.spacing(3),
  },
}));

interface IModuleErrorProps {
  errorType: 'module-doesnt-exist' | 'no-modules-found';
}

type IErrorInfo = {
  [k in IModuleErrorProps['errorType']]: {
    title: JSX.Element;
    description: JSX.Element;
  };
};

export default ({ errorType }: IModuleErrorProps) => {
  const classes = useStyles();

  const errorInfo: IErrorInfo = {
    'module-doesnt-exist': {
      title: <Typography variant="h5">Module not found</Typography>,
      description: (
        <Typography variant="body1">
          Oops! It seems you&apos;ve tried to access a module that doesn&apos;t exist.
          Click <Link to="/modules">here</Link> to go back to the list of modules
        </Typography>
      ),
    },
    'no-modules-found': {
      title: <Typography variant="h5">No modules found</Typography>,
      description: (
        <Typography variant="body1">
          No modules that match the filter criteria were found
        </Typography>
      ),
    },
  };

  return (
    <div style={{ width: '100%' }}>
      <Container>
        <Paper className={classes.root} square>
          {errorInfo[errorType].title}
          <div className={classes.body}>{errorInfo[errorType].description}</div>
        </Paper>
      </Container>
    </div>
  );
};

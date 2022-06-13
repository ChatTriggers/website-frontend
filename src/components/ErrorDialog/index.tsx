import {
  Button,
  ButtonGroup,
  Dialog,
  FormGroup,
  Theme,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import { errorStore, observer } from '~store';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(2),
  },
  title: {
    marginBottom: theme.spacing(2),
  },
  buttons: {
    display: 'flex',
    justifyContent: 'end',
    margin: theme.spacing(2),
  },
  deleteButton: {
    background: theme.palette.error.main,
  },
}));

export default observer(() => {
  const classes = useStyles();

  return (
    <Dialog
      open={errorStore.error}
      onClose={errorStore.clearError}
      maxWidth="sm"
      fullWidth
    >
      <div className={classes.root}>
        <Typography className={classes.title} variant="h4">
          {errorStore.errorTitle}
        </Typography>
        <Typography>{errorStore.errorMessage}</Typography>
        <FormGroup className={classes.buttons} row>
          <ButtonGroup size="medium">
            <Button onClick={errorStore.clearError}>Close</Button>
          </ButtonGroup>
        </FormGroup>
      </div>
    </Dialog>
  );
});

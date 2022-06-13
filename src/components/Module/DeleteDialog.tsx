import {
  Button,
  ButtonGroup,
  CircularProgress,
  Dialog,
  FormGroup,
  Theme,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';

import { deleteModule } from '~api';
import { errorStore, modulesStore } from '~store';

interface IDeleteDialogProps extends RouteComponentProps {
  open: boolean;
  close(): void;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(2),
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

export default withRouter(({ open, close, history }: IDeleteDialogProps) => {
  const classes = useStyles();
  const [loading, setLoading] = React.useState(false);

  const onDelete = async (): Promise<void> => {
    setLoading(true);
    try {
      await deleteModule(modulesStore.activeModule.id);
      setLoading(false);
      close();
    } catch (e) {
      setLoading(false);
      const err = e as Error;
      errorStore.setError('Error deleting module', err.message);
    }

    history.replace('/modules');
  };

  return (
    <Dialog open={open} onClose={close} maxWidth="sm" fullWidth>
      <div className={classes.root}>
        <Typography>
          Are you sure you want to delete this module? This is a permanent action, and
          cannot be reversed.
        </Typography>
        <FormGroup className={classes.buttons} row>
          <ButtonGroup size="medium">
            <Button onClick={close}>Cancel</Button>
            <Button className={classes.deleteButton} onClick={onDelete}>
              {loading ? <CircularProgress size={30} /> : 'Submit'}
            </Button>
          </ButtonGroup>
        </FormGroup>
      </div>
    </Dialog>
  );
});

import React from 'react';
import {
  Typography,
  FormGroup,
  Dialog,
  Theme,
  Button,
  ButtonGroup,
  CircularProgress,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import clone from 'clone';
import { deleteRelease } from '~api/raw';
import { getModules } from '~api';
import { modulesStore } from '~store';
import { IRelease } from '~src/types';

interface IDeleteDialogProps {
  open: boolean;
  close(): void;
  releaseId: string;
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

export default ({ open, close, releaseId }: IDeleteDialogProps): JSX.Element => {
  const classes = useStyles();
  const [loading, setLoading] = React.useState(false);

  const onDelete = async (): Promise<void> => {
    setLoading(true);
    await deleteRelease(modulesStore.activeModule.id, releaseId);
    getModules();
    setLoading(false);

    modulesStore.activeModule = {
      ...modulesStore.activeModule,
      releases: clone(modulesStore.activeModule.releases).reduce((prev, curr) => {
        if (curr.id !== releaseId) prev.push(curr);
        return prev;
      }, [] as IRelease[]),
    };

    close();
  };

  return (
    <Dialog
      open={open}
      onClose={close}
      maxWidth="sm"
      fullWidth
    >
      <div className={classes.root}>
        <Typography>
            Are you sure you want to delete this release? This is a permanent action,
            and cannot be reversed.
        </Typography>
        <FormGroup className={classes.buttons} row>
          <ButtonGroup size="medium">
            <Button onClick={close}>Cancel</Button>
            <Button
              className={classes.deleteButton}
              onClick={onDelete}
            >
              {loading ? <CircularProgress size={30} /> : 'Submit'}
            </Button>
          </ButtonGroup>
        </FormGroup>
      </div>
    </Dialog>
  );
};

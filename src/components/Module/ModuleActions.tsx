import React from 'react';
import clsx from 'clsx';
import { Button, Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { IModule } from '~types';
import DeleteDialog from '~components/Module/DeleteDialog';
import { authStore, observer } from '~store';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: '100%',
  },
  button: {
    marginBottom: 10,
  },
  buttonEdit: {
    backgroundColor: '#ffeb3b',
  },
  buttonDelete: {
    backgroundColor: theme.palette.error.main,
    color: theme.palette.error.contrastText,
  },
}));

interface IModuleActionsProps {
  className?: string;
  module: IModule;
  editing: boolean;
  setEditing(editing: boolean): void;
}

export default observer(({
  className, module, editing, setEditing,
}: IModuleActionsProps): JSX.Element => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const openDialog = (): void => {
    setOpen(true);
  };

  const closeDialog = (): void => {
    setOpen(false);
  };

  const clickEditButton = (): void => {
    setEditing(!editing);
  };

  const authed = authStore.isAdmin || (authStore.user && authStore.user.id === module.owner.id);

  return (
    <>
      <div className={className}>
        <DeleteDialog
          open={open}
          close={closeDialog}
          moduleId={module.id}
        />
        {authed && (
          <>
            <Button
              className={clsx(classes.button, classes.buttonEdit)}
              fullWidth
              size="small"
              variant="contained"
              onClick={clickEditButton}
            >
              {editing ? 'Done Editing Module' : 'Edit Module'}
            </Button>
            <Button
              className={clsx(classes.button, classes.buttonDelete)}
              fullWidth
              size="small"
              variant="contained"
              onClick={openDialog}
            >
              Delete Module
            </Button>
          </>
        )}
      </div>
    </>
  );
});

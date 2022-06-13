import { Fab, Theme, Tooltip } from '@material-ui/core';
import { Add as AddIcon } from '@material-ui/icons';
import { makeStyles } from '@material-ui/styles';
import React from 'react';

import CreateModuleDialog from '~components/Desktop/CreateModuleDialog';
import { authStore, observer } from '~store';

const useStyles = makeStyles((theme: Theme) => ({
  fab: {
    position: 'fixed',
    right: theme.spacing(4),
    bottom: theme.spacing(4),
  },
}));

const CreateModuleFAB = observer(() => {
  const classes = useStyles();

  const [open, setOpen] = React.useState(false);

  const onClose = (): void => {
    setOpen(false);
  };

  const onFabClick = (): void => {
    setOpen(true);
  };

  return (
    <>
      <CreateModuleDialog open={open} onClose={onClose} />
      <Tooltip title="Create Module" placement="left">
        <Fab className={classes.fab} color="primary" onClick={onFabClick}>
          <AddIcon />
        </Fab>
      </Tooltip>
    </>
  );
});

export default observer(() => {
  if (authStore.isAuthed) {
    return <CreateModuleFAB />;
  }
  return null;
});

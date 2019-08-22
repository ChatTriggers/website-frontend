import React from 'react';
import { Fab, Tooltip, Theme } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/styles';
import { Add as AddIcon } from '@material-ui/icons';
import { view } from 'react-easy-state';
import Module from './Module';
import ModuleSkeleton from './ModuleSkeleton';
import ModuleController from '../ModuleController';
import CreateModuleDialog from '../Dialogs/CreateModuleDialog';
import { Modules } from '../../../store';

const useStyles = makeStyles((theme: Theme) => createStyles({
  fab: {
    position: 'fixed',
    right: theme.spacing(4),
    bottom: theme.spacing(4)
  }
}));

export default view(() => {
  const [open, setOpen] = React.useState(false);
  const classes = useStyles();

  const onFabClick = () => {
    setOpen(isOpen => !isOpen);
  };

  const onDialogClose = () => {
    setOpen(false);
  };

  return (
    <>
      <CreateModuleDialog 
        open={open}
        close={onDialogClose}
      />
      <Tooltip title="Create Module" placement="left">
        <Fab 
          className={classes.fab} 
          color="primary"
          onClick={onFabClick}
        >
          <AddIcon />
        </Fab>
      </Tooltip>
      <ModuleController />
      {Modules.store.modules.length > 0
        ? Modules.store.modules.map(module => <Module key={module.id} {...module} />)
        : Array.from(new Array(3)).map((_, index) => <ModuleSkeleton key={index} />)}
    </>
  );
});

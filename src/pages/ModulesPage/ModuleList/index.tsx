import React from 'react';
import { Fab, Tooltip, Theme } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/styles';
import { Add as AddIcon } from '@material-ui/icons';
import Module from '../Module';
import ModuleSkeleton from './ModuleSkeleton';
import ModuleController from '~src/pages/ModulesPage/ModuleController';
import CreateModuleDialog from '~src/pages/ModulesPage/Dialogs/CreateModuleDialog';
import { modulesStore, authStore, observer } from '~store';
import ModuleError from './ModuleError';

const useStyles = makeStyles((theme: Theme) => createStyles({
  fab: {
    position: 'fixed',
    right: theme.spacing(4),
    bottom: theme.spacing(4)
  }
}));

export default observer(() => {
  const [open, setOpen] = React.useState(false);
  const classes = useStyles();

  const onFabClick = () => {
    setOpen(isOpen => !isOpen);
  };

  const onDialogClose = () => {
    setOpen(false);
  };

  const modules =
    modulesStore.error ?
      <ModuleError /> :
      modulesStore.modules.length > 0
        ? modulesStore.modules.map(module => <Module key={module.id} {...module} />)
        : Array.from(new Array(3)).map((_, index) => <ModuleSkeleton key={index} />);

  return (
    <>
      <CreateModuleDialog
        open={open}
        close={onDialogClose}
      />
      {authStore.isAuthed && (
        <Tooltip title="Create Module" placement="left">
          <Fab
            className={classes.fab}
            color="primary"
            onClick={onFabClick}
          >
            <AddIcon />
          </Fab>
        </Tooltip>
      )}
      <ModuleController />
      {modules}
    </>
  );
});

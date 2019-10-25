import React from 'react';
import clsx from 'clsx';
import {
  Button, CircularProgress, colors, Theme,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import clone from 'clone';
import { IModule } from '~types';
import DeleteDialog from '~components/Module/DeleteDialog';
import {
  authStore, observer, modulesStore, runInAction,
} from '~store';
import { toggleTrust } from '~api';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: '100%',
  },
  button: {
    marginBottom: 10,
  },
  buttonEdit: {
    backgroundColor: colors.orange[200],
  },
  buttonDelete: {
    backgroundColor: theme.palette.error.main,
    color: theme.palette.error.contrastText,
  },
  buttonTrust: {
    backgroundColor: colors.green[300],
  },
}));

interface IModuleActionsProps {
  className?: string;
}

export default observer(({ className }: IModuleActionsProps): JSX.Element => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [trustLoading, setTrustLoading] = React.useState(false);

  const openDialog = (): void => {
    setOpen(true);
  };

  const closeDialog = (): void => {
    setOpen(false);
  };

  const toggleUserTrust = async (): Promise<void> => {
    const newRank = modulesStore.activeModule.owner.rank === 'trusted' ? 'default' : 'trusted';

    setTrustLoading(true);
    await toggleTrust(modulesStore.activeModule.owner.id);

    runInAction(() => {
      modulesStore.modules = clone(modulesStore.modules).reduce((prev, curr) => {
        if (curr.owner.id !== modulesStore.activeModule.owner.id) {
          prev.push(curr);
        } else {
          const newModule = {
            ...curr,
            owner: {
              ...curr.owner,
              rank: newRank as 'default' | 'trusted' | 'admin',
            },
          };

          prev.push(newModule);
          runInAction(() => {
            modulesStore.activeModule.owner.rank = newRank;
          });
        }

        return prev;
      }, [] as IModule[]);
    });

    setTrustLoading(false);
  };

  const authed = authStore.isAdmin || (authStore.user && authStore.user.id === modulesStore.activeModule.owner.id);

  return (
    <>
      <div className={className}>
        <DeleteDialog
          open={open}
          close={closeDialog}
        />
        {authed && (
          <>
            <Button
              className={clsx(classes.button, classes.buttonDelete)}
              fullWidth
              size="small"
              variant="contained"
              onClick={openDialog}
            >
              Delete Module
            </Button>
            { /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */}
            {authStore.isAdmin && modulesStore.activeModule.owner.id !== authStore.user!.id && (
              <Button
                className={clsx(classes.button, classes.buttonTrust)}
                fullWidth
                size="small"
                variant="contained"
                onClick={toggleUserTrust}
              >
                {trustLoading
                  ? <CircularProgress size={20} />
                  : `${modulesStore.activeModule.owner.rank === 'trusted' ? 'Untrust' : 'Trust'} ${modulesStore.activeModule.owner.name}`}
              </Button>
            )}
          </>
        )}
      </div>
    </>
  );
});

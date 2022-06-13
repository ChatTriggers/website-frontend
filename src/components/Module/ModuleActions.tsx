import { Button, CircularProgress, colors, Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import clone from 'clone';
import clsx from 'clsx';
import React from 'react';

import { toggleTrust, updateModule } from '~api';
import { authStore, modulesStore, observer, runInAction } from '~store';
import { IModule } from '~types';

import DeleteDialog from './DeleteDialog';

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
  buttonFlag: {
    backgroundColor: colors.orange[300],
  },
}));

interface IModuleActionsProps {
  className?: string;
}

export default observer(({ className }: IModuleActionsProps) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [trustLoading, setTrustLoading] = React.useState(false);
  const [flaggedLoading, setFlaggedLoading] = React.useState(false);

  const openDialog = (): void => {
    setOpen(true);
  };

  const closeDialog = (): void => {
    setOpen(false);
  };

  const toggleModuleFlagged = async (): Promise<void> => {
    const m = modulesStore.activeModule;
    const newFlagged = !m.flagged;

    setFlaggedLoading(true);
    await updateModule(m.id, m.description, m.image, newFlagged);

    runInAction(() => {
      modulesStore.activeModule.flagged = newFlagged;
      modulesStore.modules = clone(modulesStore.modules).reduce((prev, curr) => {
        if (curr.id !== m.id) {
          prev.push(curr);
        } else {
          prev.push({
            ...curr,
            flagged: newFlagged,
          });
        }

        return prev;
      }, [] as IModule[]);
    });

    setFlaggedLoading(false);
  };

  const toggleUserTrust = async (): Promise<void> => {
    const newRank =
      modulesStore.activeModule.owner.rank === 'trusted' ? 'default' : 'trusted';

    setTrustLoading(true);
    await toggleTrust(modulesStore.activeModule.owner.id);

    runInAction(() => {
      modulesStore.activeModule.owner.rank = newRank;
      modulesStore.modules = clone(modulesStore.modules).reduce((prev, curr) => {
        if (curr.owner.id !== modulesStore.activeModule.owner.id) {
          prev.push(curr);
        } else {
          prev.push({
            ...curr,
            owner: {
              ...curr.owner,
              rank: newRank as 'default' | 'trusted' | 'admin',
            },
          });
        }

        return prev;
      }, [] as IModule[]);
    });

    setTrustLoading(false);
  };

  const authed =
    authStore.isTrustedOrHigher ||
    (authStore.user && authStore.user.id === modulesStore.activeModule.owner.id);

  return (
    <div className={className}>
      <DeleteDialog open={open} close={closeDialog} />
      {authed && (
        <>
          {authStore.isAdmin &&
            modulesStore.activeModule.owner.id !== authStore.user?.id && (
              <Button
                className={clsx(classes.button, classes.buttonTrust)}
                fullWidth
                size="small"
                variant="contained"
                onClick={toggleUserTrust}
              >
                {trustLoading ? (
                  <CircularProgress size={22} />
                ) : (
                  `${
                    modulesStore.activeModule.owner.rank === 'trusted'
                      ? 'Untrust'
                      : 'Trust'
                  } ${modulesStore.activeModule.owner.name}`
                )}
              </Button>
            )}
          {authStore.isTrustedOrHigher && (
            <Button
              className={clsx(classes.button, classes.buttonFlag)}
              fullWidth
              size="small"
              variant="contained"
              onClick={toggleModuleFlagged}
            >
              {flaggedLoading ? (
                <CircularProgress size={22} />
              ) : (
                `${modulesStore.activeModule.flagged ? 'Unflag module' : 'Flag module'}`
              )}
            </Button>
          )}
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
  );
});

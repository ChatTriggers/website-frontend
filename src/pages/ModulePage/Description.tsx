import { colors, IconButton, Paper, Theme } from '@material-ui/core';
import {
  Check as CheckIcon,
  Clear as ClearIcon,
  Edit as EditIcon,
} from '@material-ui/icons';
import { makeStyles } from '@material-ui/styles';
import React from 'react';

import { getModules, updateModule } from '~api';
import MarkdownEditor from '~components/MarkdownEditor';
import MarkdownRenderer from '~components/MarkdownRenderer';
import { authStore, modulesStore, observer, runInAction } from '~store';

const useStyles = makeStyles((theme: Theme) => ({
  paper: {
    padding: theme.spacing(2, 2, 1, 2),
    [theme.breakpoints.only('xs')]: {
      margin: theme.spacing(2),
    },
    [theme.breakpoints.between('sm', 'md')]: {
      margin: theme.spacing(3),
    },
    [theme.breakpoints.up('lg')]: {
      margin: theme.spacing(2, 4),
      padding: theme.spacing(3, 3, 2, 3),
      width: '100%',
      maxWidth: `calc(1000px - ${theme.spacing(1) * 2}px)`,
    },
  },
  editButton: {
    backgroundColor: colors.green[300],
    opacity: 0.8,
    margin: theme.spacing(0, 1, 2, 0),
  },
  deleteButton: {
    backgroundColor: colors.red[300],
    opacity: 0.8,
    marginBottom: theme.spacing(2),
  },
}));

export default observer(() => {
  const classes = useStyles();
  const authed =
    authStore.user &&
    (authStore.user.id === modulesStore.activeModule.owner.id ||
      authStore.isTrustedOrHigher);

  const [editing, setEditing] = React.useState(false);
  const [description, setDescription] = React.useState('');

  const onClickEditing = (): void => {
    if (editing) {
      const m = modulesStore.activeModule;

      setEditing(false);
      updateModule(m.id, description, m.image, undefined, m.tags);

      runInAction(() => {
        modulesStore.activeModule.description = description;
      });

      getModules();
    } else {
      setEditing(true);
      setDescription(modulesStore.activeModule.description);
    }
  };

  const onClickDelete = (): void => {
    setEditing(false);
  };

  return (
    <Paper className={classes.paper} square>
      {authed ? (
        <IconButton className={classes.editButton} size="small" onClick={onClickEditing}>
          {editing ? <CheckIcon /> : <EditIcon />}
        </IconButton>
      ) : (
        <div />
      )}
      {editing ? (
        <IconButton className={classes.deleteButton} size="small" onClick={onClickDelete}>
          <ClearIcon />
        </IconButton>
      ) : (
        <div />
      )}
      {editing ? (
        <MarkdownEditor value={description} handleChange={setDescription} />
      ) : (
        <MarkdownRenderer source={modulesStore.activeModule.description} />
      )}
    </Paper>
  );
});

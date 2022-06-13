import {
  Chip,
  colors,
  IconButton,
  MenuItem,
  Paper,
  TextField,
  Theme,
  Typography,
} from '@material-ui/core';
import {
  Check as CheckIcon,
  Clear as ClearIcon,
  Edit as EditIcon,
} from '@material-ui/icons';
import { makeStyles } from '@material-ui/styles';
import React from 'react';

import { getModules, updateModule } from '~api';
import TagList from '~components/Module/TagList';
import { apiStore, authStore, modulesStore, observer, runInAction } from '~store';

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
    margin: theme.spacing(0, 1),
  },
  deleteButton: {
    backgroundColor: colors.red[300],
    opacity: 0.8,
    margin: theme.spacing(0, 2, 0, 0),
  },
}));

export default observer(() => {
  const classes = useStyles();
  const authed =
    authStore.user &&
    (authStore.user.id === modulesStore.activeModule.owner.id ||
      authStore.isTrustedOrHigher);

  const [editing, setEditing] = React.useState(false);
  const [tags, setTags] = React.useState([] as string[]);

  const onClickEditing = (): void => {
    if (editing) {
      const m = modulesStore.activeModule;

      setEditing(false);
      updateModule(m.id, m.description, m.image, undefined, tags);

      runInAction(() => {
        modulesStore.activeModule.tags = tags;
      });

      getModules();
    } else {
      setEditing(true);
      setTags(modulesStore.activeModule.tags);
    }
  };

  const onChangeTags = (
    e: React.ChangeEvent<{ name?: string; value: unknown }>,
  ): void => {
    setTags(e.target.value as string[]);
  };

  const onClickDelete = (): void => {
    setEditing(false);
  };

  return (
    <Paper className={classes.paper} square>
      <div style={{ display: 'flex', marginBottom: 8 }}>
        <Typography variant="subtitle1">Tags</Typography>
        {authed ? (
          <IconButton
            className={classes.editButton}
            size="small"
            onClick={onClickEditing}
          >
            {editing ? <CheckIcon /> : <EditIcon />}
          </IconButton>
        ) : (
          <div />
        )}
        {editing ? (
          <IconButton
            className={classes.deleteButton}
            size="small"
            onClick={onClickDelete}
          >
            <ClearIcon />
          </IconButton>
        ) : (
          <div />
        )}
      </div>
      {editing ? (
        <TextField
          value={tags}
          onChange={onChangeTags}
          select
          fullWidth
          InputLabelProps={{ shrink: true }}
          SelectProps={{
            multiple: true,
            renderValue: selected =>
              (selected as string[]).map(tag => (
                <Chip style={{ marginRight: 8 }} key={tag} label={tag} />
              )),
            margin: 'dense',
            MenuProps: {
              style: {
                maxHeight: 400,
              },
            },
          }}
        >
          {apiStore.allowedTags.map(tag => (
            <MenuItem key={tag} value={tag}>
              {tag}
            </MenuItem>
          ))}
        </TextField>
      ) : (
        <TagList tags={modulesStore.activeModule.tags} maxTags={99} />
      )}
    </Paper>
  );
});

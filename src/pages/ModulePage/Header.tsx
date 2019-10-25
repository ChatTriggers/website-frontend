import React from 'react';
import {
  Typography,
  Grid,
  IconButton,
  Theme,
  colors,
  TextField,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import {
  Edit as EditIcon,
  Check as CheckIcon,
  Clear as ClearIcon,
} from '@material-ui/icons';
import ModuleActions from '~components/Module/ModuleActions';
import {
  modulesStore, authStore, runInAction, observer,
} from '~store';
import { updateModule, getModules } from '~api';
import { Desktop } from '~components/utils/DeviceUtils';

const useStyles = makeStyles((theme: Theme) => ({
  header: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  title: {
    width: '100%',
    display: 'inline-block',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  actions: {
    width: 180,
  },
  imageContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-start',
    alignContent: 'center',
  },
  image: {
    // height: '100%',
    maxWidth: `calc(100vw - ${theme.spacing(2) * 4}px)`,
    maxHeight: '180px',
    objectFit: 'contain',
  },
  body: {
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(2, 2, 0, 2),
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

export default observer((): JSX.Element => {
  const [editing, setEditing] = React.useState(false);
  const [imageUrl, setImageUrl] = React.useState('');
  const [imageValid, setImageValid] = React.useState(true);

  const classes = useStyles();
  const authed = authStore.user && (authStore.user.id === modulesStore.activeModule.owner.id || authStore.isTrustedOrHigher);

  const onClickEditing = (): void => {
    if (editing) {
      const m = modulesStore.activeModule;

      setEditing(false);
      updateModule(m.id, m.description, imageUrl, undefined, m.tags);

      runInAction(() => {
        modulesStore.activeModule.image = imageUrl;
      });

      getModules();
    } else {
      setEditing(true);
      setImageValid(true);
      setImageUrl(modulesStore.activeModule.image || '');
    }
  };

  const onClickDelete = (): void => {
    setEditing(false);
  };

  const onChangeImage = (e: React.ChangeEvent<{ name?: string; value: unknown }>): void => {
    setImageUrl(e.target.value as string);
    setImageValid(/^https?:\/\/(\w+\.)?imgur.com\/[a-zA-Z0-9]{7}\.[a-zA-Z0-9]+$/g.test(e.target.value as string));
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={3}>
        <Desktop>
          {authed ? (
            <IconButton className={classes.editButton} size="small" onClick={onClickEditing} disabled={editing && !imageValid}>
              {editing ? <CheckIcon /> : <EditIcon />}
            </IconButton>
          ) : <div />}
          {editing ? (
            <IconButton className={classes.deleteButton} size="small" onClick={onClickDelete}>
              <ClearIcon />
            </IconButton>
          ) : <div />}
        </Desktop>
        {editing && (
          <TextField
            id="module-image"
            value={imageUrl}
            onChange={onChangeImage}
            helperText={!imageValid ? 'Must be a valid imgur link' : ''}
            fullWidth
            error={!imageValid}
            style={{ marginBottom: 16 }}
          />
        )}
        {modulesStore.activeModule.image ? (
          <div className={classes.imageContainer}>
            <a href={modulesStore.activeModule.image}>
              <img
                className={classes.image}
                src={modulesStore.activeModule.image}
                alt="Module"
              />
            </a>
          </div>
        ) : <Typography variant="body1">No image</Typography>}
      </Grid>
      <Grid item xs={6}>
        <Typography
          className={classes.title}
          variant="h5"
        >
          {modulesStore.activeModule.name}
        </Typography>
        <Typography
          className={classes.title}
          variant="h6"
        >
          {`By ${modulesStore.activeModule.owner.name}`}
        </Typography>
      </Grid>
      <Grid item xs={3} style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <ModuleActions className={classes.actions} />
      </Grid>
    </Grid>
  );
});

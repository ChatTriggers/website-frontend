import {
  colors,
  Grid,
  IconButton,
  TextField,
  Theme,
  Typography,
  withWidth,
} from '@material-ui/core';
import { WithWidthProps } from '@material-ui/core/withWidth';
import {
  Check as CheckIcon,
  Clear as ClearIcon,
  Edit as EditIcon,
} from '@material-ui/icons';
import { makeStyles } from '@material-ui/styles';
import React from 'react';

import { getModules, updateModule } from '~api';
import ModuleActions from '~components/Module/ModuleActions';
import { authStore, modulesStore, observer, runInAction } from '~store';

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
    maxWidth: '100%',
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

export default withWidth()(
  observer(({ width }: WithWidthProps) => {
    const [editing, setEditing] = React.useState(false);
    const [imageUrl, setImageUrl] = React.useState('');
    const [imageValid, setImageValid] = React.useState(true);
    const [imgBottom, setImgBottom] = React.useState(width === 'xs' || width === 'sm');

    const classes = useStyles();
    const authed =
      authStore.user &&
      (authStore.user.id === modulesStore.activeModule.owner.id ||
        authStore.isTrustedOrHigher);

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

    const onChangeImage = (
      e: React.ChangeEvent<{ name?: string; value: unknown }>,
    ): void => {
      setImageUrl(e.target.value as string);
      setImageValid(
        /^https?:\/\/(\w+\.)?imgur.com\/[a-zA-Z0-9]{7}\.[a-zA-Z0-9]+$/g.test(
          e.target.value as string,
        ),
      );
    };

    const image = (
      <Grid item xs={imgBottom ? 12 : 3}>
        <div className={classes.imageContainer}>
          <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            {modulesStore.activeModule.image ? (
              <a href={modulesStore.activeModule.image}>
                <img
                  ref={ref => {
                    if (ref && !imgBottom) {
                      setImgBottom(ref.naturalWidth / ref.naturalHeight > 1.5);
                    }
                  }}
                  className={classes.image}
                  src={modulesStore.activeModule.image}
                  alt="Module"
                />
              </a>
            ) : (
              <Typography variant="body1">No image</Typography>
            )}
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
            marginTop: 8,
          }}
        >
          {authed ? (
            <IconButton
              className={classes.editButton}
              size="small"
              onClick={onClickEditing}
              disabled={editing && !imageValid}
              style={{ marginBottom: 0 }}
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
              style={{ marginBottom: 0 }}
            >
              <ClearIcon />
            </IconButton>
          ) : (
            <div />
          )}
        </div>
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
      </Grid>
    );

    const other = (
      <>
        <Grid item xs={imgBottom ? 9 : 6}>
          <Typography className={classes.title} variant="h5">
            {modulesStore.activeModule.name}
          </Typography>
          <Typography className={classes.title} variant="h6">
            {`By ${modulesStore.activeModule.owner.name}`}
          </Typography>
        </Grid>
        <Grid item xs={3} style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <ModuleActions className={classes.actions} />
        </Grid>
      </>
    );

    return (
      <Grid container spacing={2}>
        {imgBottom ? (
          <>
            {other}
            {image}
          </>
        ) : (
          <>
            {image}
            {other}
          </>
        )}
      </Grid>
    );
  }),
);

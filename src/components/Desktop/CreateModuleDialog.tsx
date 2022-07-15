import {
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  colors,
  Dialog,
  FormControlLabel,
  Grid,
  MenuItem,
  TextField,
  Theme,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import React from 'react';

import { createModule, getModules } from '~api';
import { apiStore, authStore, errorStore } from '~store';

import MarkdownEditor from '../MarkdownEditor';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    minWidth: 800,
    padding: theme.spacing(3),
  },
  title: {
    marginBottom: theme.spacing(3),
  },
  versions: {
    marginTop: theme.spacing(4),
    display: 'flex',
    justifyContent: 'space-between',
    alignContent: 'center',
  },
  buttons: {
    display: 'flex',
    justifyContent: 'right',
  },
  flagBox: {
    display: 'flex',
    justifyContent: 'left',
  },
  scriptButton: {
    width: 200,
  },
  submitButton: {
    marginRight: theme.spacing(2),
    backgroundColor: colors.green[400],
  },
  cancelButton: {
    backgroundColor: colors.red[300],
  },
  textField: {
    margin: theme.spacing(0, 4),
  },
  editor: {
    margin: theme.spacing(4, 0),
  },
}));

interface ICreateReleaseDialog {
  open: boolean;
  onClose(): void;
}

export default ({ open, onClose }: ICreateReleaseDialog) => {
  const classes = useStyles();

  const [name, setName] = React.useState('');
  const [nameError, setNameError] = React.useState(false);
  const [description, setDescription] = React.useState('');
  const [image, setImage] = React.useState('');
  const [imageError, setImageError] = React.useState(false);
  const [tags, setTags] = React.useState([] as string[]);
  const [loading, setLoading] = React.useState(false);
  const [flagged, setFlagChecked] = React.useState(false);

  const onChangeName = ({
    target,
  }: React.ChangeEvent<{ name?: string; value: unknown }>): void => {
    const n = target.value as string;
    setName(n);

    if (n.length === 0) {
      setNameError(true);
    } else {
      setNameError(!/^\w{3,64}$/g.test(n));
    }
  };

  const onChangeDescription = (desc: string): void => {
    setDescription(desc);
  };

  const onChangeImage = ({
    target,
  }: React.ChangeEvent<{ name?: string; value: unknown }>): void => {
    const img = target.value as string;
    setImage(img);

    if (img.length === 0) {
      setImageError(false);
    } else {
      setImageError(
        !/^https?:\/\/(\w+\.)?imgur.com\/[a-zA-Z0-9]{7}\.[a-zA-Z0-9]+$/g.test(img),
      );
    }
  };

  const onChangeTags = ({
    target,
  }: React.ChangeEvent<{ name?: string; value: unknown }>): void => {
    setTags(target.value as string[]);
  };

  const onSubmit = async (): Promise<void> => {
    setLoading(true);
    try {
      await createModule(name, description, tags, image, flagged);
      setLoading(false);

      getModules();
      onClose();
    } catch (e) {
      setLoading(false);
      const err = e as Error;
      errorStore.setError('Error creating module', err.message);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      classes={{
        paper: classes.root,
      }}
    >
      <Typography className={classes.title} variant="h5">
        Create Module
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <TextField
            label="Module Name"
            value={name}
            onChange={onChangeName}
            error={nameError}
            helperText={
              nameError
                ? 'The name must be alpha-numeric and between 3 and 64 characters in length'
                : ''
            }
            fullWidth
            required
            autoFocus
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Module Image"
            value={image}
            helperText="Must be an imgur link"
            onChange={onChangeImage}
            error={imageError}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Module Tags"
            value={tags}
            onChange={onChangeTags}
            select
            fullWidth
            InputLabelProps={{ shrink: true }}
            SelectProps={{
              multiple: true,
              renderValue: selected =>
                (selected as string[]).map(tag => <Chip key={tag} label={tag} />),
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
        </Grid>
        <Grid item xs={12}>
          <MarkdownEditor value={description} handleChange={onChangeDescription} />
        </Grid>
        {authStore.isTrustedOrHigher ? (
          <Grid item xs={6} className={classes.flagBox}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={flagged}
                  onChange={() => setFlagChecked(!flagged)}
                  color="primary"
                />
              }
              label="Flag Module"
              labelPlacement="start"
            />
          </Grid>
        ) : null}
        <Grid item xs={authStore.isTrustedOrHigher ? 6 : 12} className={classes.buttons}>
          <Button
            className={classes.submitButton}
            variant="contained"
            onClick={onSubmit}
            disabled={nameError || imageError}
          >
            {loading ? <CircularProgress /> : 'Submit'}
          </Button>
          <Button className={classes.cancelButton} variant="contained" onClick={onClose}>
            Cancel
          </Button>
        </Grid>
      </Grid>
    </Dialog>
  );
};

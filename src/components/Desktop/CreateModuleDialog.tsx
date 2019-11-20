import React from 'react';
import {
  TextField,
  Typography,
  Button,
  Dialog,
  Grid,
  CircularProgress,
  Theme,
  colors,
  Chip,
  MenuItem,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import MarkdownEditor from '~components/MarkdownEditor';
import { getModules, createModule } from '~api';
import { apiStore } from '~store';

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

export default ({ open, onClose }: ICreateReleaseDialog): JSX.Element => {
  const classes = useStyles();

  const [name, setName] = React.useState('');
  const [nameError, setNameError] = React.useState(false);
  const [description, setDescription] = React.useState('');
  const [image, setImage] = React.useState('');
  const [imageError, setImageError] = React.useState(false);
  const [tags, setTags] = React.useState([] as string[]);
  const [loading, setLoading] = React.useState(false);

  const onChangeName = ({ target }: React.ChangeEvent<{ name?: string; value: unknown }>): void => {
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

  const onChangeImage = ({ target }: React.ChangeEvent<{ name?: string; value: unknown }>): void => {
    const img = target.value as string;
    setImage(img);

    if (img.length === 0) {
      setImageError(false);
    } else {
      setImageError(!/^https?:\/\/(\w+\.)?imgur.com\/[a-zA-Z0-9]{7}\.[a-zA-Z0-9]+$/g.test(img));
    }
  };

  const onChangeTags = ({ target }: React.ChangeEvent<{ name?: string; value: unknown}>): void => {
    setTags(target.value as string[]);
  };

  const onSubmit = async (): Promise<void> => {
    setLoading(true);
    await createModule(name, description, tags, image || undefined);
    setLoading(false);

    getModules();
    onClose();
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
            helperText={nameError ? 'The name must be alpha-numeric and between 3 and 64 characters in length' : ''}
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
              renderValue: selected => (selected as string[]).map(tag => (
                <Chip key={tag} label={tag} />
              )),
              margin: 'dense',
              MenuProps: {
                style: {
                  maxHeight: 400,
                },
              },
            }}
          >
            {apiStore.allowedTags.map(tag => <MenuItem key={tag} value={tag}>{tag}</MenuItem>)}
          </TextField>
        </Grid>
        <Grid item xs={12}>
          <MarkdownEditor value={description} handleChange={onChangeDescription} shouldBeChangelog={false} />
        </Grid>
        <Grid item xs={12} className={classes.buttons}>
          <Button
            className={classes.submitButton}
            variant="contained"
            onClick={onSubmit}
            disabled={nameError || imageError}
          >
            {loading ? <CircularProgress /> : 'Submit'}
          </Button>
          <Button
            className={classes.cancelButton}
            variant="contained"
            onClick={onClose}
          >
            Cancel
          </Button>
        </Grid>
      </Grid>
    </Dialog>
  );
};

import React from 'react';
import {
  Container,
  Typography,
  FormGroup,
  Dialog,
  Theme,
  TextField,
  Select,
  Chip,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Button,
  ButtonGroup,
  IconButton,
  Popover,
  Input
} from '@material-ui/core';
import { HelpOutline as HelpIcon } from '@material-ui/icons';
import { makeStyles, createStyles } from '@material-ui/styles';
import { store, view } from 'react-easy-state';
import RichTextEditor from '../../../components/RichTextEditor';

interface ICreateModuleDialogProps {
  open: boolean;
  close(): void;
}

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    padding: theme.spacing(2)
  },
  moduleImage: {
    width: 250,
    margin: theme.spacing(2)
  },
  moduleTags: {
    width: 250,
    margin: theme.spacing(2)
  },
  editor: {
    // margin: theme.spacing(2)
    marginTop: theme.spacing(2)
  },
  buttons: {
    display: 'flex',
    justifyContent: 'space-between',
    margin: theme.spacing(2)
  },
  popover: {
    pointerEvents: 'none'
  }
}));

export default view((props: ICreateModuleDialogProps) => {
  const state = store({
    moduleName: '',
    moduleImage: '',
    file: undefined as File | undefined,
    tags: [] as string[],
    anchorEl: undefined as SVGSVGElement | undefined
  });
  const classes = useStyles();

  const onChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    state.moduleName = e.target.value;
  };

  const onChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    state.moduleImage = e.target.value;
  };

  const onChangeTags = (e: React.ChangeEvent<{ name?: string | undefined; value: unknown; }>) => {
    state.tags = e.target.value as string[];
  };

  const onUploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      state.file = e.target.files[0];
    }
  };

  const onDialogClose = () => {
    props.close();

    setTimeout(() => {
      state.file = undefined;
    }, 500);
  };

  const selectRenderValue = (selected: unknown) => (
    <div>
      {(selected as string[]).map(tag => (
        <Chip key={tag} label={tag} />
      ))}
    </div>
  );

  const handlePopoverOpen = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    state.anchorEl = e.currentTarget;
  };

  const handlePopoverClose = () => {
    state.anchorEl = undefined;
  };

  return (
    <Dialog
      open={props.open}
      onClose={onDialogClose}
      maxWidth="sm"
      fullWidth
    >
      <div className={classes.root}>
        <Container maxWidth="sm">
          <Typography>
            Create a Module
          </Typography>
        </Container>
        <FormGroup>
          <TextField
            style={{ margin: 10 }}
            id="module-name"
            label="Module name"
            value={state.moduleName}
            onChange={onChangeName}
            helperText="Must match the name of the folder inside the .zip file"
            fullWidth
          />
        </FormGroup>
        <RichTextEditor
          className={classes.editor}
        />
        <FormGroup row style={{ display: 'flex', justifyContent: 'center' }}>
          <TextField
            className={classes.moduleImage}
            id="module-image"
            label="Module Image Link"
            value={state.moduleImage}
            onChange={onChangeImage}
            helperText="Optional"
          />
          <FormControl
            className={classes.moduleTags}
          >
            <InputLabel htmlFor="module-tags">Module Tags</InputLabel>
            <Select
              multiple
              value={state.tags}
              onChange={onChangeTags}
              input={<Input id="module-tags" />}
              renderValue={selectRenderValue}
            >
              {['Hypixel', 'Utility', 'Library', 'HUD'].map(tag => (
                <MenuItem key={tag} value={tag}>
                  {tag}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>Optional</FormHelperText>
          </FormControl>
        </FormGroup>
        <FormGroup className={classes.buttons} row>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div>
              <input
                accept=".zip"
                id="module-file-upload"
                type="file"
                style={{ display: 'none' }}
                onChange={onUploadFile}
              />
              <label htmlFor="module-file-upload">
                <Button id="module-file-upload-button" variant="contained" component="span">
                  Upload scripts zip file
                </Button>
                <IconButton size="small" style={{ marginLeft: 10 }}>
                  <HelpIcon onMouseEnter={handlePopoverOpen} onMouseLeave={handlePopoverClose} />
                </IconButton>
              </label>
            </div>
            <Container style={{ height: 0, paddingTop: 5 }}>
              <label htmlFor="module-file-upload-button">
                {(state.file && state.file.name) || 'No file selected'}
              </label>
            </Container>
          </div>
          <ButtonGroup size="medium">
            <Button onClick={onDialogClose}>Cancel</Button>
            <Button color="secondary">Upload</Button>
          </ButtonGroup>
        </FormGroup>
      </div>
      <Popover
        className={classes.popover}
        open={state.anchorEl !== undefined}
        anchorEl={state.anchorEl}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        transformOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <Typography>
          Help text here
        </Typography>
      </Popover>
    </Dialog>
  );
});

import React from 'react';
import { FormGroup, Dialog, Theme, TextField, Select, Chip, FormControl, InputLabel, MenuItem, Input } from '@material-ui/core';
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
    width: '40%',
    margin: '5%'
  },
  moduleTags: {
    width: '40%',
    margin: '5%'
  },
  editor: {
    margin: 10
  }
}));

export default view((props: ICreateModuleDialogProps) => {
  const state = store({
    moduleName: '',
    moduleImage: '',
    tags: [] as string[]
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

  const selectRenderValue = (selected: unknown) => (
    <div>
      {(selected as string[]).map(tag => (
        <Chip key={tag} label={tag} />
      ))}
    </div>
  );

  return (
    <Dialog
      open={props.open}
      onClose={props.close}
      className={classes.root}
    >
      <FormGroup>
        <TextField 
          id="module-name"
          title="Module name"
          value={state.moduleName}
          onChange={onChangeName}
          helperText="Must match the name of the folder inside the .zip file"
          fullWidth
        />
      </FormGroup>
      <RichTextEditor 
        className={classes.editor}
      />
      <FormGroup row>
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
        </FormControl>
      </FormGroup>
    </Dialog>
  );
});

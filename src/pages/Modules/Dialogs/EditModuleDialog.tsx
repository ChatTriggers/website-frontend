import React from 'react';
import {
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
  Popover,
  Input,
  StyleRulesCallback
} from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { observer, observable, action, modulesStore } from '~store';

interface IEditModuleDialogProps {
  open: boolean;
  close(): void;
}

// tslint:disable-next-line:no-any
const styles: StyleRulesCallback<any, any> = (theme: Theme) => ({
  root: {
    padding: theme.spacing(2)
  },
  title: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center'
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
    margin: theme.spacing(2),
    width: theme.spacing(2) * 2 + 500
  },
  buttons: {
    display: 'flex',
    justifyContent: 'end',
    margin: theme.spacing(2)
  },
  popover: {
    pointerEvents: 'none'
  }
});

@observer
class EditModuleDialog extends React.Component<IEditModuleDialogProps> {
  @observable
  private moduleName = '';

  @observable
  private moduleImage = '';

  @observable
  private moduleDescription = '';

  @observable
  private file: File | undefined;

  @observable
  private tags: string[] = [];

  @observable
  private anchorEl: SVGSVGElement | undefined;

  @action
  private readonly onChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.moduleName = e.target.value;
  }

  @action
  private readonly onChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.moduleImage = e.target.value;
  }

  @action
  private readonly onChangeDescription = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.moduleDescription = e.target.value;
  }

  @action
  private readonly onChangeTags = (e: React.ChangeEvent<{ name?: string | undefined; value: unknown; }>) => {
    this.tags = e.target.value as string[];
  }

  @action
  private readonly onUploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      this.file = e.target.files[0];
    }
  }

  @action
  private readonly onDialogClose = () => {
    this.props.close();

    setTimeout(action(() => {
      this.file = undefined;
    }), 500);
  }

  private readonly selectRenderValue = (selected: unknown) => (
    <div>
      {(selected as string[]).map(tag => (
        <Chip key={tag} label={tag} />
      ))}
    </div>
  )

  @action
  private readonly handlePopoverOpen = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    this.anchorEl = e.currentTarget;
  }

  @action
  private readonly handlePopoverClose = () => {
    this.anchorEl = undefined;
  }

  private get classes() {
    return (this.props as unknown as {
      classes: {
        [K in keyof ReturnType<typeof styles>]: string;
      }
    }).classes;
  }

  public render() {
    return (
      <Dialog
        open={this.props.open}
        onClose={this.onDialogClose}
        maxWidth="sm"
        fullWidth
      >
        <div className={this.classes.root}>
          <div className={this.classes.title}>
            <Typography variant="h5">
              Edit Module
            </Typography>
          </div>
          <TextField
            className={this.classes.editor}
            id="module-description"
            label="Module Description"
            value={this.moduleDescription}
            onChange={this.onChangeDescription}
            multiline
            helperText="Optional"
          />
          <FormGroup row style={{ display: 'flex', justifyContent: 'center' }}>
            <TextField
              className={this.classes.moduleImage}
              id="module-image"
              label="Module Image Link"
              value={this.moduleImage}
              onChange={this.onChangeImage}
              helperText="Optional"
            />
            <FormControl
              className={this.classes.moduleTags}
            >
              <InputLabel htmlFor="module-tags">Module Tags</InputLabel>
              <Select
                multiple
                value={this.tags}
                onChange={this.onChangeTags}
                input={<Input id="module-tags" />}
                renderValue={this.selectRenderValue}
              >
                {modulesStore.allowedTags.map(tag => ( // TODO: Get actual tags from website
                  <MenuItem key={tag} value={tag}>
                    {tag}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>Optional</FormHelperText>
            </FormControl>
          </FormGroup>
          <FormGroup className={this.classes.buttons} row>
            <ButtonGroup size="medium">
              <Button onClick={this.onDialogClose}>Cancel</Button>
              <Button color="secondary">Submit</Button>
            </ButtonGroup>
          </FormGroup>
        </div>
        <Popover
          className={this.classes.popover}
          open={this.anchorEl !== undefined}
          anchorEl={this.anchorEl}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          transformOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          onClose={this.handlePopoverClose}
          disableRestoreFocus
        >
          <Typography>
            Help text here
          </Typography>
        </Popover>
      </Dialog>
    );
  }
}

export default withStyles(styles, { withTheme: true })(EditModuleDialog);

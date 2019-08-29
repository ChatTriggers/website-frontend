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
  Input,
  StyleRulesCallback
} from '@material-ui/core';
import { HelpOutline as HelpIcon } from '@material-ui/icons';
import { withStyles } from '@material-ui/styles';
import { observer, observable, action } from '~store';
import RichTextEditor from '~components/RichTextEditor';

interface ICreateModuleDialogProps {
  open: boolean;
  close(): void;
}

// tslint:disable-next-line:no-any
const styles: StyleRulesCallback<any, any> = (theme: Theme) => ({
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
});

@observer
class CreateModuleDialog extends React.Component<ICreateModuleDialogProps> {
  @observable
  private moduleName = '';

  @observable
  private moduleImage = '';

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
              value={this.moduleName}
              onChange={this.onChangeName}
              helperText="Must match the name of the folder inside the .zip file"
              fullWidth
            />
          </FormGroup>
          <RichTextEditor
            className={this.classes.editor}
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
                {['Hypixel', 'Utility', 'Library', 'HUD'].map(tag => (
                  <MenuItem key={tag} value={tag}>
                    {tag}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>Optional</FormHelperText>
            </FormControl>
          </FormGroup>
          <FormGroup className={this.classes.buttons} row>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div>
                <input
                  accept=".zip"
                  id="module-file-upload"
                  type="file"
                  style={{ display: 'none' }}
                  onChange={this.onUploadFile}
                />
                <label htmlFor="module-file-upload">
                  <Button id="module-file-upload-button" variant="contained" component="span">
                    Upload scripts zip file
                  </Button>
                  <IconButton size="small" style={{ marginLeft: 10 }}>
                    <HelpIcon onMouseEnter={this.handlePopoverOpen} onMouseLeave={this.handlePopoverClose} />
                  </IconButton>
                </label>
              </div>
              <Container style={{ height: 0, paddingTop: 5 }}>
                <label htmlFor="module-file-upload-button">
                  {(this.file && this.file.name) || 'No file selected'}
                </label>
              </Container>
            </div>
            <ButtonGroup size="medium">
              <Button onClick={this.onDialogClose}>Cancel</Button>
              <Button color="secondary">Upload</Button>
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

export default withStyles(styles, { withTheme: true })(CreateModuleDialog);

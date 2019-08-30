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
  StyleRulesCallback,
  CircularProgress
} from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { observer, observable, action, modulesStore, computed } from '~store';
import { updateModule, getModules } from '~api';

interface IEditModuleDialogProps {
  open: boolean;
  close(): void;
  moduleId: number;
  description: string;
  image?: string;
  tags?: string[];
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
  private moduleImage = this.props.image;

  @observable
  private moduleDescription = this.props.description;

  @observable
  private tags = this.props.tags;

  @observable
  private loading = false;

  @observable
  private readonly valid = {
    image: true,
    description: true
  };

  @computed
  get isValid() {
    return this.valid.image && this.valid.description;
  }

  @observable
  private anchorEl: SVGSVGElement | undefined;

  @action
  private readonly onChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.moduleImage = e.target.value || undefined;
    this.valid.image = this.moduleImage === undefined ||
      (!!this.moduleImage && /https?:\/\/(www.)?(i\.)?imgur\.com\//.test(this.moduleImage.toLowerCase()));
  }

  @action
  private readonly onChangeDescription = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.moduleDescription = e.target.value;
    this.valid.description = !!this.moduleDescription;
  }

  @action
  private readonly onChangeTags = (e: React.ChangeEvent<{ name?: string | undefined; value: unknown; }>) => {
    this.tags = e.target.value as string[];
  }

  @action
  private readonly onDialogClose = () => {
    this.props.close();
  }

  private readonly selectRenderValue = (selected: unknown) => (
    <div>
      {(selected as string[]).map(tag => (
        <Chip key={tag} label={tag} />
      ))}
    </div>
  )

  @action
  private readonly handlePopoverClose = () => {
    this.anchorEl = undefined;
  }

  private readonly onUpload = async () => {
    action(() => { this.loading = true; })();
    // tslint:disable-next-line:no-non-null-assertion
    await updateModule(this.props.moduleId, this.moduleDescription!, this.moduleImage, false, this.tags);
    action(() => { this.loading = false; })();
    this.props.close();
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
            error={!this.valid.description}
            multiline
          />
          <FormGroup row style={{ display: 'flex', justifyContent: 'center' }}>
            <TextField
              className={this.classes.moduleImage}
              id="module-image"
              label="Module Image Link"
              value={this.moduleImage}
              onChange={this.onChangeImage}
              helperText="Optional (must be imgur link)"
              error={!this.valid.image}
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
              <Button onClick={this.onUpload} color="secondary" disabled={this.loading || !this.isValid}>
                {this.loading ? <CircularProgress size={30} /> : 'Update'}
              </Button>
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

import React from 'react';
import {
  Typography,
  FormGroup,
  Dialog,
  Theme,
  Button,
  ButtonGroup,
  StyleRulesCallback,
  CircularProgress
} from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { observer, observable, action } from '~store';
import { deleteModule } from '~api';
import { StyledComponent } from '~components';

interface ICreateModuleDialogProps {
  open: boolean;
  close(): void;
  moduleId: number;
}

// tslint:disable-next-line:no-any
const styles: StyleRulesCallback<any, any> = (theme: Theme) => ({
  root: {
    padding: theme.spacing(2)
  },
  buttons: {
    display: 'flex',
    justifyContent: 'end',
    margin: theme.spacing(2)
  },
  deleteButton: {
    background: theme.palette.error.main
  },
});

@observer
class CreateModuleDialog extends StyledComponent<typeof styles, ICreateModuleDialogProps> {
  @observable
  private loading = false;

  @action
  private readonly onDialogClose = () => {
    this.props.close();
  }

  private readonly onDelete = async () => {
    action(() => { this.loading = true; })();
    // tslint:disable-next-line:no-non-null-assertion
    await deleteModule(this.props.moduleId);
    action(() => { this.loading = false; })();
    this.props.close();
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
          <Typography>
            Are you sure you want to delete this module? This is a permanent action,
            and cannot be reversed.
          </Typography>
          <FormGroup className={this.classes.buttons} row>
            <ButtonGroup size="medium">
              <Button onClick={this.onDialogClose}>Cancel</Button>
              <Button
                className={this.classes.deleteButton}
                onClick={this.onDelete}
              >
                {this.loading ? <CircularProgress size={30} /> : 'Submit'}
              </Button>
            </ButtonGroup>
          </FormGroup>
        </div>
      </Dialog>
    );
  }
}

export default withStyles(styles, { withTheme: true })(CreateModuleDialog);

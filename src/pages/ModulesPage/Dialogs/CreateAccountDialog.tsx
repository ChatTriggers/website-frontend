import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  CircularProgress
} from '@material-ui/core';
import { observer, observable, action } from '~store';
import { createUser } from '~api';

interface ICreateAccountDialogProps {
  open: boolean;
  close(): void;
}

@observer
export default class CreateAccountDialog extends React.Component<ICreateAccountDialogProps> {
  @observable
  private username = '';

  @observable
  private email = '';

  @observable
  private password = '';

  @observable
  private loading = false;

  @action
  public onChangeUsername = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    this.username = e.currentTarget.value;
  }

  @action
  public onChangeEmail = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    this.email = e.currentTarget.value;
  }

  @action
  public onChangePassword = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    this.password = e.currentTarget.value;
  }

  @action
  public onSubmit = async () => {
    this.loading = true;

    try {
      await createUser(this.username, this.email, this.password);
      console.log('created account and logged in');
      this.loading = false;
      this.props.close();
    } catch (e) {
      console.error(e);
      // TODO: Handle error
    }
  }

  public render() {
    return (
      <Dialog
        open={this.props.open}
        onClose={this.props.close}
      >
        <DialogTitle>
          Create Account
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="username"
            label="Username"
            type="text"
            onChange={this.onChangeUsername}
            fullWidth
          />
          <TextField
            margin="dense"
            id="email"
            label="Email address"
            type="text"
            onChange={this.onChangeEmail}
            fullWidth
          />
          <TextField
            margin="dense"
            id="password"
            label="Password"
            type="password"
            onChange={this.onChangePassword}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={this.props.close} color="primary">
            Cancel
          </Button>
          <Button onClick={this.onSubmit} color="primary" disabled={this.loading}>
            {this.loading ? <CircularProgress size={30} /> : 'Submit'}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

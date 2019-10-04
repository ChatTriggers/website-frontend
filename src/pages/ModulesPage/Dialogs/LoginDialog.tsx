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
import { login } from '~api';

interface ICreateAccountDialogProps {
  open: boolean;
  close(): void;
}

@observer
export default class LoginDialog extends React.Component<ICreateAccountDialogProps> {
  @observable
  private username = '';

  @observable
  private password = '';

  @observable
  private loading = false;

  @action
  public onChangeUsername = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    this.username = e.currentTarget.value;
  }

  @action
  public onChangePassword = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    this.password = e.currentTarget.value;
  }

  @action
  public onSubmit = async () => {
    // Do some quick validation before we hit the server
    if(!this.username || !this.password) {
      alert('You must provide a username and password to login!')
      this.loading = false;
      return null;
    }

    try {
      action(() => { this.loading = true; })();
      await login(this.username, this.password);
      action(() => { this.loading = false; })();
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
          Login
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
            {this.loading ? <CircularProgress size={30} /> : 'Login'}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

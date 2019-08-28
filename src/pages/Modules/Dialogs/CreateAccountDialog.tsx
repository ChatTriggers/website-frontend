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
import { store, view } from 'react-easy-state';
import { Auth } from '~store';
import { login, createUser } from '~api';

interface ICreateAccountDialogProps {
  open: boolean;
  close(): void;
}

@view
export default class CreateAccountDialog extends React.Component<ICreateAccountDialogProps> {
  private readonly data = store({
    username: '',
    email: '',
    password: '',
    loading: false
  });

  public onChangeUsername = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    this.data.username = e.currentTarget.value;
  }

  public onChangeEmail = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    this.data.email = e.currentTarget.value;
  }

  public onChangePassword = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    this.data.password = e.currentTarget.value;
  }

  public onSubmit = async () => {
    this.data.loading = true;
    const result = await createUser(this.data.username, this.data.email, this.data.password);
    
    if (result.ok) {
      console.log('created account');
      
      const result2 = await login(this.data.username, this.data.password);
      this.data.loading = false;
      
      if (result2.ok) {
        Auth.store.user = result2.value;
        this.props.close();
      } else {
        console.log('this should never happen');
      }
    } else {
      console.log('no created account :(');
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
          <Button onClick={this.onSubmit} color="primary" disabled={this.data.loading}>
            {this.data.loading ? <CircularProgress size={30} /> : 'Submit'}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

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
import { observable, action } from 'mobx';
import { observer, inject } from 'mobx-react';
import { AuthStore } from '../../../store';
import { login, createUser } from '../../../api';

interface ICreateAccountDialogProps {
  open: boolean;
  close(): void;
}

interface IInjectedProps extends ICreateAccountDialogProps {
  authStore: AuthStore;
}

@inject('authStore')
@observer
export default class LoginDialog extends React.Component<ICreateAccountDialogProps> {
  @observable
  private username = '';

  @observable
  private email = '';

  @observable
  private password = '';

  @observable
  private loading = false;

  get injected() {
    return this.props as IInjectedProps;
  }

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
    const result = await createUser(this.username, this.email, this.password);
    
    if (result.ok) {
      console.log('created account');
      
      const result2 = await login(this.username, this.password);
      this.loading = false;
      
      if (result2.ok) {
        this.injected.authStore.authedUser = result2.value;
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
          <Button onClick={this.onSubmit} color="primary" disabled={this.loading}>
            {this.loading ? <CircularProgress size={30} /> : 'Submit'}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

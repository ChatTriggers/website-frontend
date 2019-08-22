import React from 'react';
import { Dialog } from '@material-ui/core';

interface ICreateModuleDialogProps {
  open: boolean;
  close(): void;
}

export default (props: ICreateModuleDialogProps) => {
  return (
    <Dialog
      open={props.open}
      onClose={props.close}
    >
      <p>test</p>
    </Dialog>
  );
};

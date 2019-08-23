import React from 'react';
import { Dialog } from '@material-ui/core';
import RichTextEditor from '../../../components/RichTextEditor';

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
      <RichTextEditor />
    </Dialog>
  );
};

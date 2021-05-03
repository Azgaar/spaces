import React, {FC} from 'react';
import {Dialog, DialogTitle, DialogActions, DialogContent, Button} from '@material-ui/core';

type DialogProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

const ConfirmationDialog: FC<DialogProps> = ({open, onClose, onConfirm}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Confirm action</DialogTitle>
      <DialogContent>Please reconsider as the action cannot be undone.</DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={onConfirm} color="primary">
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;

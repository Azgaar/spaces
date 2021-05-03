import React, {useState} from 'react';
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Link} from '@material-ui/core';
import {TERMS_OF_USE} from './Text/terms';
import {PRIVACY_POLICY} from './Text/privacy';

const Terms = () => {
  const [dialog, setDialog] = useState('');
  const openTerms = () => setDialog(() => 'Terms of use');
  const openPrivacy = () => setDialog(() => 'Privacy policy');
  const closeDialog = () => setDialog(() => '');

  const text = dialog === 'Terms of use' ? TERMS_OF_USE : PRIVACY_POLICY;
  return (
    <>
      {'I accept the '}
      <Link onClick={openTerms}>terms of use</Link>
      {' and '}
      <Link onClick={openPrivacy}>privacy policy</Link>

      <Dialog open={Boolean(dialog)} onClose={closeDialog} scroll="paper">
        <DialogTitle>SPɅCES: {dialog}</DialogTitle>
        <DialogContent dividers={true}>
          <DialogContentText style={{whiteSpace: 'pre-line'}}>{text}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Terms;

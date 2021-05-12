import React, {useState, FC} from 'react';
import useStyles from './DeletionButton.style';
import {Box, Button, Typography} from '@material-ui/core';

type DeletionProps = {
  object?: string;
  title?: string;
  confirm?: string;
  cancel?: string;
  short?: boolean;
  showText?: boolean;
  onDelete: () => void;
  disabled?: boolean;
};

const DeletionButton: FC<DeletionProps> = ({object, onDelete, title, confirm = 'Delete', cancel = 'Cancel', short = false, showText = true, disabled = false}) => {
  const [confirmDelection, setConfirmDelection] = useState(false);
  const classes = useStyles();

  const handleDelete = () => onDelete();
  const handleCancel = () => setConfirmDelection(() => false);
  const handleConfirm = () => setConfirmDelection(() => true);

  const getText = () => (short ? `Are you sure you want to delete the ${object}?` : `Are you sure you want to delete the ${object}? The deletion cannot be rolled back`);

  return confirmDelection ? (
    <Box component="span" mx={1} px={1} className={classes.box}>
      {showText && (
        <Typography component="span" className={classes.text} variant="body2" color="textPrimary">
          {getText()}
        </Typography>
      )}
      <Button variant="contained" color="primary" onClick={handleCancel}>
        {cancel}
      </Button>
      <Button variant="contained" color="primary" onClick={handleDelete}>
        {confirm}
      </Button>
    </Box>
  ) : (
    <Box component="span" mx={1}>
      <Button variant="contained" color="primary" onClick={handleConfirm} disabled={disabled}>
        {title || 'Delete ' + object}
      </Button>
    </Box>
  );
};

export default DeletionButton;

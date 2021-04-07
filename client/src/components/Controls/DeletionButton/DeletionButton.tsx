import React, {useState} from "react";
import useStyles from "./DeletionButton.style";
import {Box, Button, Typography} from "@material-ui/core";

type DeletionProps = {
  object: string,
  title?: string,
  short?: boolean,
  onDelete: () => void;
}

const DeletionButton = ({object, onDelete, title, short}: DeletionProps) => {
  const [confirmDelection, setConfirmDelection] = useState(false);
  const classes = useStyles();

  const handleDelete = () => onDelete();
  const handleCancel = () => setConfirmDelection(() => false);
  const handleConfirm = () => setConfirmDelection(() => true);

  const text = short
    ? `Are you sure you want to delete the ${object}?`
    : `Are you sure you want to delete the ${object}? The deletion cannot be rolled back`;

  return (
    confirmDelection ? (
      <Box component="span" m={1} p={1} className={classes.box}>
        <Typography component="span" className={classes.text} variant="body2" color="textPrimary">{text}</Typography>
        <Button variant="contained" color="primary" onClick={handleCancel}>Cancel</Button>
        <Button variant="contained" color="primary" onClick={handleDelete}>Delete</Button>
      </Box>
    ) : (
      <Box component="span" m={1}>
        <Button variant="contained" color="primary" onClick={handleConfirm}>{title || "Delete " + object}</Button>
      </Box>
    )
  );
}

export default DeletionButton;

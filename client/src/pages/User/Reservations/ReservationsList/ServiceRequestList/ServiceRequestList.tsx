import React, {ChangeEvent, useState} from 'react';
import useStyles from './ServiceRequestList.style';
import {List, ListItem, ListItemIcon, ListItemText, ListItemSecondaryAction, IconButton, TextField} from '@material-ui/core';
import {ServiceRes} from '../../../../../types';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import RequestStatusIcon from '../../../../../components/Icons/RequestStatusIcon/RequestStatusIcon';
import ClearIcon from '@material-ui/icons/Clear';
import DoneIcon from '@material-ui/icons/Done';
import ConfirmationDialog from '../../../../../components/Controls/ConfirmationDialog/ConfirmationDialog';

type Props = {
  requests: ServiceRes[];
  editable: boolean;
  handleDelete: (id: string) => void;
  handleCreate: (description: string) => void;
};

type CreationRequest = {
  isActive: boolean;
  value: string;
  error: boolean | string;
};

type DeletionRequest = {
  isActive: boolean;
  id: null | string;
};

const ServiceRequestList = ({requests, editable, handleDelete, handleCreate}: Props) => {
  const classes = useStyles();
  const [creation, setCreation] = useState<CreationRequest>({isActive: false, value: '', error: true});
  const [deletion, setDeletion] = useState<DeletionRequest>({isActive: false, id: null});

  const toggleAddRequestInput = () => setCreation((creation) => ({...creation, isActive: !creation.isActive}));
  const hideAddRequestInput = () => setCreation(() => ({...creation, isActive: false}));
  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCreation(() => ({isActive: true, value, error: validate(value)}));
  };
  const validate = (value: string) => {
    if (!value || value.length < 3) {return 'Min request length is 3 characters';}
    if (value.length > 512) {return 'Max request length is 512 characters';}
    return false;
  };
  const confirmCreation = () => {
    if (creation.error) {return;}
    handleCreate(creation.value);
    setCreation(() => ({isActive: false, value: '', error: true}));
  };

  const showDeleteRequestDialog = (id: string) => setDeletion(() => ({isActive: true, id}));
  const hideDeleteRequestDialog = () => setDeletion(() => ({isActive: false, id: null}));
  const confirmDeletion = () => handleDelete(deletion.id as string);

  return (
    <List dense={true} className={classes.list}>
      <ListItem>
        <ListItemText disableTypography={true}>{requests.length ? 'Requested services:' : 'Add services'}</ListItemText>
        {editable && (
          <ListItemSecondaryAction>
            <IconButton edge="end" aria-label="addItem" onClick={toggleAddRequestInput}>
              <AddCircleOutlineIcon fontSize="inherit" />
            </IconButton>
          </ListItemSecondaryAction>
        )}
      </ListItem>

      {requests.map((request) => (
        <ListItem key={request.id}>
          <ListItemIcon>
            <RequestStatusIcon value={request.status} />
          </ListItemIcon>
          <ListItemText disableTypography={true}>{request.description}</ListItemText>
          {editable && (
            <ListItemSecondaryAction>
              <IconButton edge="end" aria-label="removeItem" onClick={() => showDeleteRequestDialog(request.id)}>
                <ClearIcon fontSize="inherit" />
              </IconButton>
            </ListItemSecondaryAction>
          )}
        </ListItem>
      ))}

      {creation.isActive && (
        <ListItem>
          <TextField value={creation.value} onChange={handleInput} autoFocus error={!!creation.error} helperText={!!creation.error && <>{creation.error}</>} />
          <ListItemSecondaryAction>
            {!creation.error && (
              <IconButton edge="end" aria-label="addLineItem" onClick={confirmCreation}>
                <DoneIcon fontSize="inherit" />
              </IconButton>
            )}
            <IconButton edge="end" aria-label="cancelAddingItem" onClick={hideAddRequestInput}>
              <ClearIcon fontSize="inherit" />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      )}

      <ConfirmationDialog open={deletion.isActive} onConfirm={confirmDeletion} onClose={hideDeleteRequestDialog} />
    </List>
  );
};

export default ServiceRequestList;

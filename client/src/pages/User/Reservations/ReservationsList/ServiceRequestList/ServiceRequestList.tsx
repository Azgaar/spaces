import React, {ChangeEvent, useState} from "react";
import useStyles from "./ServiceRequestList.style";
import {List, ListItem, ListItemIcon, ListItemText, ListItemSecondaryAction, IconButton, TextField} from "@material-ui/core";
import {ServiceRes} from "../../../../../types";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import RequestStatusIcon from "../../../../../components/Icons/RequestStatusIcon/RequestStatusIcon";
import ClearIcon from "@material-ui/icons/Clear";
import DoneIcon from "@material-ui/icons/Done";
import ConfirmationDialog from "../../../../../components/Controls/ConfirmationDialog/ConfirmationDialog";

type Props = {
  requests: ServiceRes[];
  editable: boolean;
  handleDelete: (id: string) => void;
  handleCreate: (description: string) => void;
}

type AddRequest = {
  isActive: boolean;
  value: string;
  error: boolean | string;
}

const ServiceRequestList = ({requests, editable, handleDelete, handleCreate}: Props) => {
  const classes = useStyles();
  const [addRequest, setAddRequest] = useState<AddRequest>({isActive: false, value: "", error: true});
  const [confirm, setConfirm] = useState<string>("");

  const showAddRequestInput = () => setAddRequest(() => ({...addRequest, isActive: true}));
  const hideAddRequestInput = () => setAddRequest(() => ({...addRequest, isActive: false}));

  const requestDeletion = (id: string) => setConfirm(() => id);
  const confirmDeletion = () => {
    handleDelete(confirm);
    setConfirm(() => "");
  }
  const cancelDeletion = () => setConfirm(() => "");

  const handleAdd = () => {
    handleCreate(addRequest.value);
    setAddRequest(() => ({isActive: false, value: "", error: true}));
  };

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAddRequest(() => ({isActive: true, value, error: validate(value)}));
  }

  const validate = (value: string) => {
    if (!value || value.length < 3) return "Min request length is 3 characters";
    if (value.length > 512) return "Max request length is 512 characters";
    return false;
  }

  return (
    <List dense={true} className={classes.list}>
      <ListItem>
        <ListItemText disableTypography={true}>{requests.length ? "Requested services:" : "Add services"}</ListItemText>
        {editable && 
          <ListItemSecondaryAction>
            <IconButton edge="end" aria-label="addItem" onClick={showAddRequestInput}>
              <AddCircleOutlineIcon fontSize="inherit" />
            </IconButton>
          </ListItemSecondaryAction>
        }
      </ListItem>

      {requests.map(request => (
        <ListItem key={request.id}>
          <ListItemIcon>
            <RequestStatusIcon value={request.status} />
          </ListItemIcon>
          <ListItemText disableTypography={true}>{request.description}</ListItemText>
          {editable && 
            <ListItemSecondaryAction>
              <IconButton edge="end" aria-label="removeItem" onClick={() => requestDeletion(request.id)}>
                <ClearIcon fontSize="inherit" />
              </IconButton>
            </ListItemSecondaryAction>
          }
        </ListItem>
      ))}

      {addRequest.isActive &&
        <ListItem>
          <TextField value={addRequest.value} onChange={handleInput} autoFocus
            error={!!addRequest.error} helperText={addRequest.error} />
          <ListItemSecondaryAction>
            {!addRequest.error &&
              <IconButton edge="end" aria-label="addLineItem">
                <DoneIcon fontSize="inherit" onClick={handleAdd} />
              </IconButton>
            }
            <IconButton edge="end" aria-label="cancelAddingItem">
              <ClearIcon fontSize="inherit" onClick={hideAddRequestInput} />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      }

      <ConfirmationDialog open={!!confirm} onConfirm={confirmDeletion} onClose={cancelDeletion} />
    </List>
  );
};

export default ServiceRequestList;

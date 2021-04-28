import React, {ChangeEvent, useState} from "react";
import useStyles from "./ServiceRequestList.style";
import {List, ListItem, ListItemIcon, ListItemText, ListItemSecondaryAction, IconButton} from "@material-ui/core";
import {ServiceRes} from "../../../../../types";
import DeleteIcon from "@material-ui/icons/Delete";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import RequestStatusIcon from "../../../../../components/Icons/RequestStatusIcon/RequestStatusIcon";
import ClearIcon from "@material-ui/icons/Clear";
import DoneIcon from "@material-ui/icons/Done";

const ServiceRequestList = ({requests, editable}: {requests: ServiceRes[]; editable: boolean}) => {
  const classes = useStyles();
  const [addRequest, setAddRequest] = useState({isActive: false, value: ""});

  const showAddRequestInput = () => setAddRequest(() => ({...addRequest, isActive: true}));
  const hideAddRequestInput = () => setAddRequest(() => ({...addRequest, isActive: false}));

  const handleDelete = (id: string) => {
    console.log(id);
  };

  const handleAdd = () => {
    console.log(addRequest.value);
    setAddRequest(() => ({isActive: false, value: ""}));
  };

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAddRequest(() => ({isActive: true, value}));
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
              <IconButton edge="end" aria-label="removeItem" onClick={() => handleDelete(request.id)}>
                <DeleteIcon fontSize="inherit" />
              </IconButton>
            </ListItemSecondaryAction>
          }
        </ListItem>
      ))}

      {addRequest.isActive &&
        <ListItem>
          <input value={addRequest.value} onInput={handleInput} autoFocus />
          <ListItemSecondaryAction>
            <IconButton edge="end" aria-label="addLineItem">
                <DoneIcon fontSize="inherit" onClick={handleAdd} />
              </IconButton>
            <IconButton edge="end" aria-label="cancelAddingItem">
              <ClearIcon fontSize="inherit" onClick={hideAddRequestInput} />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      }
    </List>
  );
};

export default ServiceRequestList;

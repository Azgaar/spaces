import React from "react";
import useStyles from "./ServiceRequestList.style";
import {List, ListItem, ListItemIcon, ListItemText, ListItemSecondaryAction, IconButton} from "@material-ui/core";
import {ServiceRes} from "../../../../../types";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import RequestStatusIcon from "../../../../../components/Icons/RequestStatusIcon/RequestStatusIcon";

const ServiceRequestList = ({requests}: {requests: ServiceRes[]}) => {
  const classes = useStyles();

  const handleEdit = (id: string) => {
    console.log(id);
  }

  const handleDelete = (id: string) => {
    console.log(id);
  }

  return (
    <List dense={true} className={classes.list} subheader={<>Requested services:</>}>
      {requests.map(request => (
          <ListItem key={request.id}>
            <ListItemIcon>
              <RequestStatusIcon value={request.status} />
            </ListItemIcon>
            <ListItemText disableTypography={true}>{request.description}</ListItemText>
            <ListItemSecondaryAction>
              <IconButton edge="end" aria-label="removeItem" onClick={() => handleEdit(request.id)}>
                <EditIcon fontSize="inherit" />
              </IconButton>
              <IconButton edge="end" aria-label="removeItem" onClick={() => handleDelete(request.id)}>
                <DeleteIcon fontSize="inherit" />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        )
      )}
    </List>
  );
};

export default ServiceRequestList;

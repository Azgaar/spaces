import React, {useState} from "react";
import useStyles from "./AddServices.style";
import {Container, FormControl, Dialog, IconButton, List, ListItem, ListItemSecondaryAction, ListItemText, TextField, Button} from "@material-ui/core";
import Headline from "../../../../components/Layout/components/Main/Headline/Headline";
import {Autocomplete} from "@material-ui/lab";
import DeleteIcon from '@material-ui/icons/Delete';

const defaultServiceOptions: string[] = ["Clean workspace", "Bring projector", "Bring speakerphone", "Bring telephone",
  "Bring adapter", "Bring headset", "Bring additional chair", "Orginize coffee break"];

type Props = {
  open: boolean;
  services: string[];
  onClose: () => void;
  onAdd: (value: string) => void;
  onDelete: (value: string) => void;
};

const AddServices = ({open, services, onClose, onAdd, onDelete}: Props) => {
  const classes = useStyles();
  const [service, setService] = useState<{value: string, input: string}>({value: "", input: ""});

  const handleAdd = (value: string | null) => {
    setService(() => ({value: "", input: ""}));
    if (!value) return;
    onAdd(value);
  }

  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title">
      <Container className={classes.paper}>
        <Headline pagename="Request Services" />

        <FormControl fullWidth className={classes.form}>
          <Autocomplete fullWidth value={service.value} inputValue={service.input}
            options={defaultServiceOptions} handleHomeEndKeys freeSolo clearOnEscape
            onChange={(e, value) => handleAdd(value)}
            onInputChange={(e, value) => setService(service => ({...service, input: value}))}
            renderInput={params => <TextField {...params} label="Service" variant="outlined" autoFocus />} />

          <List dense className={classes.list}>
            {!services.length && <ListItem>Select a service from the list above or type a free text request and press Enter</ListItem>}
            {services.map(value => (
                <ListItem key={value}>
                  <ListItemText>{value}</ListItemText>
                  <ListItemSecondaryAction>
                    <IconButton edge="end" aria-label="removeItem" onClick={() => onDelete(value)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              )
            )}
          </List>

          <Button variant="contained" color="primary" onClick={onClose}>Close</Button>
        </FormControl>
      </Container>
    </Dialog>
  );
};

export default AddServices;

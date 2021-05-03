import React, {useState} from 'react';
import useStyles from './AddServices.style';
import {Container, FormControl, Dialog, IconButton, List, ListItem, ListItemSecondaryAction, ListItemText, TextField, Button} from '@material-ui/core';
import Headline from '../../../../components/Layout/components/Main/Headline/Headline';
import {Autocomplete} from '@material-ui/lab';
import DeleteIcon from '@material-ui/icons/Delete';

const defaultServiceOptions: string[] = [
  'Clean workspace',
  'Bring projector',
  'Bring speakerphone',
  'Bring telephone',
  'Bring adapter',
  'Bring headset',
  'Bring additional chair',
  'Orginize coffee break'
];

type Props = {
  open: boolean;
  services: string[];
  onClose: () => void;
  onAdd: (value: string) => void;
  onDelete: (value: string) => void;
};

const AddServices = ({open, services, onClose, onAdd, onDelete}: Props) => {
  const classes = useStyles();
  const blankService = {value: '', input: '', error: false};
  const [service, setService] = useState<Service>(blankService);

  const handleAdd = (value: string | null) => {
    if (service.error) {return;}
    setService(() => blankService);
    if (!value) {return;}
    onAdd(value);
  };

  const handleInputChange = (inputValue: string) => {
    setService((service) => ({...service, input: inputValue, error: validate(inputValue)}));
  };

  const validate = (value: string) => {
    if (!value || value.length < 3) {return 'Min request length is 3 characters';}
    if (value.length > 512) {return 'Max request length is 512 characters';}
    return false;
  };

  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title">
      <Container className={classes.paper}>
        <Headline pagename="Request Services" />

        <FormControl fullWidth className={classes.form}>
          <Autocomplete
            fullWidth
            value={service.value}
            inputValue={service.input}
            options={defaultServiceOptions}
            handleHomeEndKeys
            freeSolo
            clearOnEscape
            onChange={(e, value) => handleAdd(value)}
            onInputChange={(e, value) => handleInputChange(value)}
            renderInput={(params) => <TextField {...params} label="Service" variant="outlined" autoFocus error={!!service.error} helperText={service.error} />}
          />

          <List dense className={classes.list}>
            {!services.length && <ListItem>Select a service from the list above or type a free text request and press Enter</ListItem>}
            {services.map((value) => (
              <ListItem key={value}>
                <ListItemText>{value}</ListItemText>
                <ListItemSecondaryAction>
                  <IconButton edge="end" aria-label="removeItem" onClick={() => onDelete(value)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>

          <Button variant="contained" color="primary" onClick={onClose}>
            Close
          </Button>
        </FormControl>
      </Container>
    </Dialog>
  );
};

type Service = {
  value: string;
  input: string;
  error: boolean | string;
};

export default AddServices;

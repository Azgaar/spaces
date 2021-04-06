import React, {useEffect, useState} from "react";
import useStyles from "./Workspaces.style";
import {Avatar, Button, Container, Grid, TextField, Typography} from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import DesktopWindowsIcon from "@material-ui/icons/DesktopWindows";
import WorkspacesList from "./WorkspacesList/WorkspacesList";
import {Autocomplete} from "@material-ui/lab";
import {MessageType, useMessage} from "../../components/providers/MessageProvider";
import axios from "axios";

function Workspaces() {
  const classes = useStyles();
  const {pushMessage} = useMessage();
  const [isLoading, setLoading] = useState(true);
  const [addresses, setAddresses] = useState<AddressOption[]>([]);
  const [address, setAddress] = useState<AddressState>({id: null, description: "", add: false, rename: false, delete: false});

  useEffect(() => {
    axios.post("/getAddresses", {}, {withCredentials: true})
      .then(res => {
        if (!res.data) throw Error("Cannot fetch users");
        setAddress(() => res.data)
      })
      .catch(err => {
        pushMessage({title: err.message, type: MessageType.ERROR});
        setAddresses(() => [
          {id: "1", description: "1st floor"},
          {id: "2", description: "2nd floor"},
          {id: "3", description: "3rd floor"},
        ]);
      })
      .then(() => setLoading(false));
  }, []);

  const handleAddressChange = (value: AddressOption | string | null) => {
    if (!value) setAddress(() => ({id: null, description: "", add: false, rename: false, delete: false}));
    else if (typeof value === "string") setAddress(() => ({id: null, description: value, add: true, rename: false, delete: false}));
    else setAddress(() => ({id: value.id, description: value.description, add: false, rename: true, delete: true}));
    console.log(value, address);
  }

  return (
    <Container maxWidth="lg" className={classes.container}>
      <Avatar className={classes.avatar}>
        <DesktopWindowsIcon />
      </Avatar>
      <Typography component="h1" variant="h5" className={classes.header}>Manage Workspaces</Typography>

      <Container>
        <Grid container alignItems="center">
          <Grid item xs={3}>
            <Autocomplete id="addresses" options={addresses} getOptionLabel={option => option.description}
              handleHomeEndKeys freeSolo loading={isLoading} onChange={(e, value) => handleAddressChange(value)}
              renderInput={(params) => (
                <TextField {...params} label="Select Address" variant="outlined" InputProps={{...params.InputProps, endAdornment: (
                    <>
                      {isLoading ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}/>
              )} />
          </Grid>
          <Grid item xs={9}>
            {address.add && <Button variant="contained" color="primary" className={classes.control}>Add</Button>}
            {address.rename && <Button variant="contained" color="primary" className={classes.control}>Rename</Button>}
            {address.delete && <Button variant="contained" color="primary" className={classes.control}>Delete</Button>}
          </Grid>
        </Grid>
      </Container>
      <WorkspacesList />
    </Container>
  );
}

type AddressOption = {
  id: string,
  description: string
}

type AddressState = {
  id: string | null,
  description: string,
  add: boolean,
  rename: boolean,
  delete: boolean
}

export default Workspaces;

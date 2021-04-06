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
  const [addressInput, setAddressInput] = useState<string>("");
  const [addressId, setAddressId] = useState<string | null>(null);

  useEffect(() => {
    axios.post("/getAddresses", {}, {withCredentials: true})
      .then(res => {
        if (!res.data) throw Error("Cannot fetch users");
        setAddresses(() => res.data)
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
    if (!value) setAddressId(() => null);
    else if (typeof value === "string") return;
    else setAddressId(() => value.id);
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
              handleHomeEndKeys freeSolo
              onChange={(e, value) => handleAddressChange(value)} onInputChange={(e, value) => setAddressInput(() => value)}
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
            {addressInput && !addressId && <Button variant="contained" color="primary" className={classes.control}>Add</Button>}
            {addressId && <Button variant="contained" color="primary" className={classes.control}>Rename</Button>}
            {addressId && <Button variant="contained" color="primary" className={classes.control}>Delete</Button>}
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

export default Workspaces;

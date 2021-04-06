import React, {useEffect, useState} from "react";
import useStyles from "./Workspaces.style";
import {Avatar, Button, Container, Grid, TextField, Typography} from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import DesktopWindowsIcon from "@material-ui/icons/DesktopWindows";
import WorkspacesList from "./WorkspacesList/WorkspacesList";
import {Autocomplete} from "@material-ui/lab";
import {MessageType, useMessage} from "../../components/providers/MessageProvider";
import axios, { AxiosPromise } from "axios";

function Workspaces() {
  const classes = useStyles();
  const {pushMessage} = useMessage();
  const [isLoading, setLoading] = useState(true);
  const [locations, setLocations] = useState<LocationOption[]>([]);
  const [locationInput, setLocationInput] = useState<string>("");
  const [locationId, setLocationId] = useState<string | null>(null);

  const handleAdressesRequest = (req: AxiosPromise) => {
    req.then(res => {
      if (!res.data) throw Error("Cannot fetch locations");
      setLocations(() => res.data);
    })
    .catch(err => pushMessage({title: err.message, type: MessageType.ERROR}))
    .then(() => setLoading(false));
  }

  useEffect(() => {
    handleAdressesRequest(axios.post("/getLocations", {}, {withCredentials: true}));
  }, []);

  const handleLocationChange = (value: LocationOption | string | null) => {
    if (!value) setLocationId(() => null);
    else if (typeof value === "string") return;
    else setLocationId(() => value.id);
  }

  const addLocation = () => {
    setLoading(true);
    handleAdressesRequest(axios.post("/addLocation", {locationInput}, {withCredentials: true}));
  }

  const renameLocation = () => {
    setLoading(true);
    handleAdressesRequest(axios.post("/renameLocation", {locationId}, {withCredentials: true}));
  }

  const deleteLocation = () => {
    setLoading(true);
    handleAdressesRequest(axios.delete("/deleteLocation", {data: locationId, withCredentials: true}));
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
            <Autocomplete id="locations" options={locations} getOptionLabel={option => option.description}
              handleHomeEndKeys freeSolo
              onChange={(e, value) => handleLocationChange(value)} onInputChange={(e, value) => setLocationInput(() => value)}
              renderInput={(params) => (
                <TextField {...params} label="Select Location" variant="outlined" InputProps={{...params.InputProps, endAdornment: (
                    <>
                      {isLoading ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}/>
              )} />
          </Grid>
          <Grid item xs={9}>
            {locationInput && !locationId && <Button variant="contained" color="primary" className={classes.control} onClick={addLocation}>Add</Button>}
            {locationId && <Button variant="contained" color="primary" className={classes.control} onClick={renameLocation}>Rename</Button>}
            {locationId && <Button variant="contained" color="primary" className={classes.control} onClick={deleteLocation}>Delete</Button>}
          </Grid>
        </Grid>
      </Container>
      <WorkspacesList />
    </Container>
  );
}

type LocationOption = {
  id: string,
  description: string
}

export default Workspaces;

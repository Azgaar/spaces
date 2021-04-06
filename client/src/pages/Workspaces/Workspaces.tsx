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
  const locationDefault: LocationOption = {id: null, description: ""};
  const [location, setLocation] = useState<LocationOption>(locationDefault);
  const [locationList, setLocationList] = useState<LocationOption[]>([]);
  const [locationInput, setLocationInput] = useState<string>("");

  const handleLocationRequest = (req: AxiosPromise) => {
    req.then(res => {
      if (!res.data) throw Error("Cannot fetch locations");
      setLocationList(() => res.data);
    })
    .catch(err => pushMessage({title: err.message, type: MessageType.ERROR}))
    .then(() => setLoading(false));
  }

  useEffect(() => {
    handleLocationRequest(axios.post("/getLocations", {}, {withCredentials: true}));
  }, []);

  const handleLocationChange = (value: LocationOption | string | null) => {
    if (!value) setLocation(() => locationDefault);
    else if (typeof value === "string") return;
    else setLocation(() => value);
  }

  const addLocation = () => {
    setLoading(true);
    handleLocationRequest(axios.post("/addLocation", {description: locationInput}, {withCredentials: true}));
    if (locationList.length) setLocation(() => locationList[locationList.length - 1]);
  }

  const renameLocation = () => {
    setLoading(true);
    handleLocationRequest(axios.post("/renameLocation", {id: location.id, description: locationInput}, {withCredentials: true}));
  }

  const deleteLocation = () => {
    setLoading(true);
    handleLocationRequest(axios.delete("/deleteLocation", {data: {id: location.id}, withCredentials: true}));
    setLocation(() => locationDefault);
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
            <Autocomplete id="locations" value={location} options={locationList} getOptionLabel={option => option.description}
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
            {locationInput && !location.id && <Button variant="contained" color="primary" className={classes.control} onClick={addLocation}>Add</Button>}
            {location.id && locationInput !== location.description && <Button variant="contained" color="primary" className={classes.control} onClick={renameLocation}>Rename</Button>}
            {location.id && <Button variant="contained" color="primary" className={classes.control} onClick={deleteLocation}>Delete</Button>}
          </Grid>
        </Grid>
      </Container>
      <WorkspacesList />
    </Container>
  );
}

type LocationOption = {
  id: string | null,
  description: string
}

export default Workspaces;

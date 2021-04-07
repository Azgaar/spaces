import React, {useEffect, useState} from "react";
import useStyles from "./Workspaces.style";
import {Avatar, Button, Container, Grid, TextField, Typography} from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import DesktopWindowsIcon from "@material-ui/icons/DesktopWindows";
import WorkspacesList from "./WorkspacesList/WorkspacesList";
import {Autocomplete} from "@material-ui/lab";
import DeletionButton from "../../components/Controls/DeletionButton/DeletionButton";
import {MessageType, useMessage} from "../../components/providers/MessageProvider";
import axios from "axios";
import {LocationOption} from "../../types";
import {useRequest} from "../../hooks";

function Workspaces() {
  const classes = useStyles();
  const {pushMessage} = useMessage();
  const locationDefault: LocationOption = {id: null, description: ""};
  const [location, setLocation] = useState<LocationOption>(locationDefault);
  const [locationList, setLocationList] = useState<LocationOption[]>([]);
  const [locationInput, setLocationInput] = useState<string>("");
  const {isLoading, error, handleRequest} = useRequest();

  useEffect(() => {
    async function fetchLocations() {
      const res: LocationOption[] = await handleRequest(axios.post("/getLocations", {}, {withCredentials: true}));
      if (res) setLocationList(() => res);
      else pushMessage({title: error, type: MessageType.ERROR});
    };
    fetchLocations();
  }, []);

  const handleLocationChange = (value: LocationOption | string | null) => {
    if (!value) setLocation(() => locationDefault);
    else if (typeof value === "string") return;
    else setLocation(() => value);
  }

  const addLocation = async () => {
    const addedLocation: LocationOption = await handleRequest(axios.post("/addLocation", {description: locationInput}, {withCredentials: true}));
    if (addedLocation) {
      pushMessage({title: `Location "${locationInput}" is added`, type: MessageType.SUCCESS});
      setLocationList(locations => [...locations, addedLocation]);
      setLocation(() => addedLocation);
    } else {
      pushMessage({title: error, type: MessageType.ERROR});
    }
  }

  const renameLocation = async () => {
    const allLocations: LocationOption[] = await handleRequest(axios.post("/renameLocation", {id: location.id, description: locationInput}, {withCredentials: true}));
    if (allLocations) {
      pushMessage({title: `Location "${locationInput}" is renamed`, type: MessageType.SUCCESS});
      setLocationList(() => allLocations);
      setLocation(() => ({id: location.id, description: locationInput}));
    } else {
      pushMessage({title: error, type: MessageType.ERROR});
    }
  }

  const deleteLocation = async () => {
    const allLocations: LocationOption[] = await handleRequest(axios.delete("/deleteLocation", {data: {id: location.id}, withCredentials: true}));
    if (allLocations) {
      pushMessage({title: `Location "${location.description}" is deleted`, type: MessageType.SUCCESS});
      setLocationList(() => allLocations);
      setLocation(() => locationDefault);
    } else {
      pushMessage({title: error, type: MessageType.ERROR});
    }
  }

  return (
    <Container maxWidth="lg" className={classes.container}>
      <Avatar className={classes.avatar}>
        <DesktopWindowsIcon />
      </Avatar>
      <Typography component="h1" variant="h5" className={classes.header}>Manage Workspaces</Typography>

      <Container>
        <Grid container alignItems="center">
          <Grid item xs={4}>
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
          <Grid item xs={8}>
            {locationInput && !location.id && <Button variant="contained" color="primary" className={classes.control} onClick={addLocation}>Add</Button>}
            {location.id && locationInput !== location.description && <Button variant="contained" color="primary" className={classes.control} onClick={renameLocation}>Rename</Button>}
            {location.id && <DeletionButton onDelete={deleteLocation} object="location" title="Delete" short />}
          </Grid>
        </Grid>
      </Container>
      <WorkspacesList location={location} />
    </Container>
  );
}

export default Workspaces;

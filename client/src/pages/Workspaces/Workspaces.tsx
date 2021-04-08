import React, {useEffect, useState} from "react";
import useStyles from "./Workspaces.style";
import {Avatar, Button, Container, Grid, TextField, Typography} from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import DesktopWindowsIcon from "@material-ui/icons/DesktopWindows";
import WorkspacesList from "./WorkspacesList/WorkspacesList";
import {Autocomplete} from "@material-ui/lab";
import DeletionButton from "../../components/Controls/DeletionButton/DeletionButton";
import {MessageType, useMessage} from "../../components/providers/MessageProvider";
import {LocationOption} from "../../types";
import {useRequest} from "../../hooks";
import {LocationService} from "../../services";

function Workspaces() {
  const classes = useStyles();
  const {pushMessage} = useMessage();
  const locationDefault: LocationOption = {id: "", description: ""};
  const [location, setLocation] = useState<LocationOption>(locationDefault);
  const [locationList, setLocationList] = useState<LocationOption[]>([]);
  const [locationInput, setLocationInput] = useState<string>("");
  const {isLoading, handleRequest} = useRequest();

  useEffect(() => {
    async function fetchLocations() {
      const allLocations: LocationOption[] = await handleRequest(LocationService.list());
      if (allLocations) setLocationList(() => allLocations);
    };
    fetchLocations();
  }, []);

  const handleLocationChange = (value: LocationOption | string | null) => {
    if (!value) setLocation(() => locationDefault);
    else if (typeof value === "string") return;
    else setLocation(() => value);
  }

  const addLocation = async () => {
    const addedLocation: LocationOption = await handleRequest(LocationService.add(locationInput));
    if (addedLocation) {
      pushMessage({title: `Location "${locationInput}" is added`, type: MessageType.SUCCESS});
      setLocationList(locations => [...locations, addedLocation]);
      setLocation(() => addedLocation);
    }
  }

  const renameLocation = async () => {
    const allLocations: LocationOption[] = await handleRequest(LocationService.rename(location.id, locationInput));
    if (allLocations) {
      pushMessage({title: `Location "${locationInput}" is renamed`, type: MessageType.SUCCESS});
      setLocationList(() => allLocations);
      setLocation(() => ({id: location.id, description: locationInput}));
    }
  }

  const deleteLocation = async () => {
    const remainingLocations: LocationOption[] = await handleRequest(LocationService.remove(location.id));
    if (remainingLocations) {
      pushMessage({title: `Location "${location.description}" is deleted`, type: MessageType.SUCCESS});
      setLocationList(() => remainingLocations);
      setLocationInput(() => "");
      setLocation(() => locationDefault);
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
              onChange={(e, value) => handleLocationChange(value)} onInputChange={(e, value) => setLocationInput(() => value)}
              handleHomeEndKeys freeSolo renderInput={(params) => (
                <TextField {...params} label="Select Location" variant="outlined" InputProps={{...params.InputProps, endAdornment: (
                    <>
                      {isLoading && <CircularProgress color="inherit" size={20} />}
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
      <WorkspacesList loc={location} />
    </Container>
  );
}

export default Workspaces;

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

  const handleRequest = async (request: AxiosPromise) => {
    setLoading(true);
    try {
      const res = await request;
      return res.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      pushMessage({title: message, type: MessageType.ERROR});
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    async function fetchLocations() {
      const res = await handleRequest(axios.post("/getLocations", {}, {withCredentials: true}));
      if (res && Array.isArray(res)) setLocationList(() => res);
    };
    fetchLocations();
  }, []);

  const handleLocationChange = (value: LocationOption | string | null) => {
    if (!value) setLocation(() => locationDefault);
    else if (typeof value === "string") return;
    else setLocation(() => value);
  }

  const addLocation = async () => {
    const res = await handleRequest(axios.post("/addLocation", {description: locationInput}, {withCredentials: true}));
    if (!res || !Array.isArray(res)) return;
    pushMessage({title: `Location "${locationInput}" is added`, type: MessageType.SUCCESS});
    setLocationList(() => res);
    setLocation(() => locationList[locationList.length - 1]);
  }

  const renameLocation = async () => {
    const res = await handleRequest(axios.post("/renameLocation", {id: location.id, description: locationInput}, {withCredentials: true}));
    if (!res || !Array.isArray(res)) return;
    pushMessage({title: `Location "${locationInput}" is renamed`, type: MessageType.SUCCESS});
    setLocationList(() => res);
    setLocation(() => ({id: location.id, description: locationInput}));
  }

  const deleteLocation = async () => {
    const res = await handleRequest(axios.delete("/deleteLocation", {data: {id: location.id}, withCredentials: true}));
    if (!res || !Array.isArray(res)) return;
    pushMessage({title: `Location "${location.description}" is deleted`, type: MessageType.SUCCESS});
    setLocationList(() => res);
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

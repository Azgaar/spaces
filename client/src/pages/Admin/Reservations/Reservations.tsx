import React, {useEffect, useState} from "react";
import useStyles from "./Reservations.style";
import {Avatar, Container, Grid, TextField, Typography} from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import ReservationsList from "./ReservationsList/ReservationsList";
import LibraryBooksIcon from "@material-ui/icons/LibraryBooks";
import {Autocomplete} from "@material-ui/lab";
import {LocationOption} from "../../../types";
import {useToasterCatcher} from "../../../hooks";
import {LocationService} from "../../../services";

function Reservations() {
  const classes = useStyles();
  const blankLocation: LocationOption = {id: "", description: ""};
  const [location, setLocation] = useState<LocationOption>(blankLocation);
  const [locationList, setLocationList] = useState<LocationOption[]>([]);
  const {isLoading, catchAndTossError} = useToasterCatcher();

  useEffect(() => {
    async function fetchLocations() {
      const nonEmptyLocations: LocationOption[] = await catchAndTossError(LocationService.list({empty: false}));
      if (!nonEmptyLocations) return;

      setLocationList(() => nonEmptyLocations);
      const stored = localStorage.getItem("location");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (nonEmptyLocations.find(loc => loc.id === parsed.id)) setLocation(() => parsed);
        else localStorage.removeItem("location");
      }
    };
    fetchLocations();
  }, []);

  const handleLocationChange = (value: LocationOption | string | null) => {
    if (!value) setLocation(() => blankLocation);
    if (!value || typeof value === "string") return;

    setLocation(() => value);
    localStorage.setItem("location", JSON.stringify(value));
  }

  return (
    <Container maxWidth="lg" className={classes.container}>
      <Avatar className={classes.avatar}>
        <LibraryBooksIcon />
      </Avatar>
      <Typography component="h1" variant="h5" className={classes.header}>Manage Reservations</Typography>

      <Container>
        <Grid container alignItems="center">
          <Grid item xs={4}>
            <Autocomplete id="locations" value={location} options={locationList} getOptionLabel={option => option.description}
              onChange={(e, value) => handleLocationChange(value)} handleHomeEndKeys renderInput={(params) => (
                <TextField {...params} label="Select Location" variant="outlined" InputProps={{...params.InputProps, endAdornment: (
                    <>
                      {isLoading && <CircularProgress color="inherit" size={20} />}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}/>
              )} />
          </Grid>
        </Grid>
      </Container>
      <ReservationsList loc={location} />
    </Container>
  );
}

export default Reservations;

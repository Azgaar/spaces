import React, {useEffect, useState} from "react";
import useStyles from "./Reservations.style";
import {Box, Avatar, Link, Container, Grid, TextField, Typography} from "@material-ui/core";
import {Link as RouterLink} from "react-router-dom";
import CircularProgress from "@material-ui/core/CircularProgress";
import ReservationsList from "./ReservationsList/ReservationsList";
import LibraryBooksIcon from "@material-ui/icons/LibraryBooks";
import {Autocomplete} from "@material-ui/lab";
import {LocationOption} from "../../../types";
import {useLocations} from "../../../hooks";

function Reservations() {
  const classes = useStyles();
  const blankLocation: LocationOption = {id: "", description: ""};
  const [location, setLocation] = useState(blankLocation);
  const {locations, locationsLoading, defaultLocation, fetchLocations} = useLocations();

  useEffect(() => {
    fetchLocations({onlyWithWorkspaces: true});
  }, []);

  useEffect(() => {
    setLocation(() => defaultLocation)
  }, [defaultLocation]);

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
          <Grid item lg={4} md={6} xs={12}>
            <Autocomplete id="locations" value={location} options={locations} getOptionLabel={option => option.description}
              onChange={(e, value) => handleLocationChange(value)} handleHomeEndKeys renderInput={(params) => (
                <TextField {...params} label="Select Location" variant="outlined" InputProps={{...params.InputProps, endAdornment: (
                    <>
                      {locationsLoading && <CircularProgress color="inherit" size={20} />}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}/>
              )} />
          </Grid>

          <Grid item lg={4} md={6} xs={12}>
            <Box mx={1}>
              <Link href="#" variant="body2" component={RouterLink} to="/reservations">Show my active reservations</Link>
            </Box>
            <Box mx={1}>
              <Link href="#" variant="body2" component={RouterLink} to="/history">Show my reservations history</Link>
            </Box>
          </Grid>
        </Grid>
      </Container>
      <ReservationsList loc={location} />
    </Container>
  );
}

export default Reservations;

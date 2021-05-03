import React, {useEffect, FC} from 'react';
import useStyles from './Reservations.style';
import {Container, Grid, TextField, ButtonGroup, Button, Box} from '@material-ui/core';
import {Link} from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';
import ReservationsList from './ReservationsList/ReservationsList';
import {Autocomplete} from '@material-ui/lab';
import {LocationOption} from '../../../types';
import {useLocations} from '../../../hooks';
import Headline from '../../../components/Layout/components/Main/Headline/Headline';

const Reservations: FC = () => {
  const classes = useStyles();
  const blankLocation: LocationOption = {id: '', description: ''};
  const {locations, locationsLoading, location, setLocation, fetchLocations} = useLocations();

  useEffect(() => {
    fetchLocations({onlyWithWorkspaces: true});
  }, []);

  const handleLocationChange = (value: LocationOption | string | null) => {
    if (!value) {
      setLocation(() => blankLocation);
    }
    if (!value || typeof value === 'string') {
      return;
    }

    setLocation(() => value);
    localStorage.setItem('location', JSON.stringify(value));
  };

  return (
    <Container maxWidth="lg" className={classes.container}>
      <Headline pagename="Manage Reservations" />

      <Container>
        <Grid container alignItems="center">
          <Grid item lg={4} md={6} xs={12}>
            <Autocomplete
              id="locations"
              value={location}
              options={locations}
              getOptionLabel={(option) => option.description}
              onChange={(e, value) => handleLocationChange(value)}
              handleHomeEndKeys
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Location"
                  variant="outlined"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {locationsLoading && <CircularProgress color="inherit" size={20} />}
                        {params.InputProps.endAdornment}
                      </>
                    )
                  }}
                />
              )}
            />
          </Grid>

          <Grid item lg={8} md={6} xs={12}>
            <Box display="flex" justifyContent="flex-end">
              <ButtonGroup variant="contained" color="secondary">
                <Button component={Link} to="/reserve">
                  Reserve
                </Button>
                <Button component={Link} to="/reservations">
                  Active
                </Button>
                <Button component={Link} to="/history">
                  History
                </Button>
              </ButtonGroup>
            </Box>
          </Grid>
        </Grid>
      </Container>
      <ReservationsList loc={location} />
    </Container>
  );
};

export default Reservations;

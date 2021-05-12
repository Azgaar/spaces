import React, {useEffect, useState, FC} from 'react';
import useStyles from './Requests.style';
import {Container, Box, ButtonGroup, Button, TextField, CircularProgress, Grid} from '@material-ui/core';
import {Autocomplete} from '@material-ui/lab';
import RequestList from './RequestList/RequestList';
import {LocationOption, ServiceRequestStatus} from '../../../types';
import {useLocations} from '../../../hooks';
import Content from '../../../components/Layout/components/Main/Content';

const Requests: FC = () => {
  const classes = useStyles();
  const [statusFilter, setStatusFilter] = useState<ServiceRequestStatus>(ServiceRequestStatus.PENDING);
  const {locations, locationsLoading, location, setLocation, fetchLocations} = useLocations();

  useEffect(() => {
    fetchLocations({onlyWithWorkspaces: true});
  }, []);

  const handleLocationChange = (value: LocationOption | string | null) => {
    if (!value) {
      setLocation(() => ({id: '', description: ''}));
    }
    if (!value || typeof value === 'string') {
      return;
    }

    setLocation(() => value);
    localStorage.setItem('location', JSON.stringify(value));
  };

  return (
    <Content maxWidth="lg" marginTop={5} pagename="Manage Service Requests">
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
                {Object.values(ServiceRequestStatus).map((status) => (
                  <Button key={status} onClick={() => setStatusFilter(() => status)} className={statusFilter === status ? classes.selectedButton : ''}>
                    {status}
                  </Button>
                ))}
              </ButtonGroup>
            </Box>
          </Grid>
        </Grid>
      </Container>

      <RequestList location={location} status={statusFilter} />
    </Content>
  );
};

export default Requests;

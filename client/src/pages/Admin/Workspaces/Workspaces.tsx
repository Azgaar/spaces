import React, {useEffect, useState, FC} from 'react';
import useStyles from './Workspaces.style';
import {Box, Button, ButtonGroup, Container, Grid, TextField} from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import WorkspacesList from './WorkspacesList/WorkspacesList';
import {Autocomplete} from '@material-ui/lab';
import DeletionButton from '../../../components/Controls/DeletionButton/DeletionButton';
import {MessageType, useMessage} from '../../../components/Providers/MessageProvider';
import {LocationOption} from '../../../types';
import {useLocations, useToasterCatcher} from '../../../hooks';
import {LocationService} from '../../../services';
import Content from '../../../components/Layout/components/Main/Content';
import LocationScheme from '../../../components/Layout/components/Main/LocationScheme/LocationScheme';

const Workspaces: FC = () => {
  const classes = useStyles();
  const {pushMessage} = useMessage();
  const blankLocation: LocationOption = {id: '', description: ''};
  const {locations, setLocations, locationsLoading, location, setLocation, fetchLocations} = useLocations();
  const [locationInput, setLocationInput] = useState<string>('');
  const {catchAndTossError} = useToasterCatcher();
  const [displayMode, setDisplayMode] = useState<'scheme' | 'table'>('scheme');

  useEffect(() => {
    fetchLocations({onlyWithWorkspaces: false});
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

  const addLocation = async () => {
    const addedLocation = (await catchAndTossError(LocationService.add(locationInput))) as LocationOption | undefined;
    if (addedLocation) {
      pushMessage({title: `Location "${locationInput}" is added`, type: MessageType.SUCCESS});
      setLocations((locations) => [...locations, addedLocation]);
      setLocation(() => addedLocation);
    }
  };

  const renameLocation = async () => {
    const allLocations = await catchAndTossError(LocationService.rename(location.id, locationInput));
    if (allLocations) {
      pushMessage({title: `Location "${locationInput}" is renamed`, type: MessageType.SUCCESS});
      setLocations(() => allLocations as LocationOption[]);
      setLocation(() => ({id: location.id, description: locationInput}));
    }
  };

  const deleteLocation = async () => {
    const remainingLocations = await catchAndTossError(LocationService.remove(location.id));
    if (remainingLocations) {
      pushMessage({title: `Location "${location.description}" is deleted`, type: MessageType.SUCCESS});
      setLocations(() => remainingLocations as LocationOption[]);
      setLocationInput(() => '');
      setLocation(() => blankLocation);
    }
  };

  return (
    <Content maxWidth="lg" marginTop={5} pagename="Manage Workspaces">
      <Container>
        <Grid container alignItems="center">
          <Grid item lg={4} md={6} xs={12}>
            <Autocomplete
              id="locations"
              value={location}
              options={locations}
              getOptionLabel={(option) => option.description}
              onChange={(e, value) => handleLocationChange(value)}
              onInputChange={(e, value) => setLocationInput(() => value)}
              handleHomeEndKeys
              freeSolo
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

          <Grid item lg={4} md={6} xs={12}>
            {locationInput && !location.id && (
              <Button variant="contained" color="primary" className={classes.control} onClick={addLocation}>
                Add
              </Button>
            )}
            {location.id && locationInput !== location.description && (
              <Button variant="contained" color="primary" className={classes.control} onClick={renameLocation}>
                Rename
              </Button>
            )}
            {location.id && <DeletionButton onDelete={deleteLocation} object="location" title="Delete" short />}
          </Grid>

          <Grid item lg={4} md={6} xs={12}>
            <Box display="flex" justifyContent="flex-end">
              <ButtonGroup variant="contained" color="secondary">
                <Button className={displayMode === 'scheme' ? classes.selectedButton : ''} onClick={() => setDisplayMode(() => 'scheme')}>
                  Scheme
                </Button>
                <Button className={displayMode === 'table' ? classes.selectedButton : ''} onClick={() => setDisplayMode(() => 'table')}>
                  Table
                </Button>
              </ButtonGroup>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {displayMode === 'scheme' && <LocationScheme location={location} />}
      {displayMode === 'table' && <WorkspacesList loc={location} />}
    </Content>
  );
};

export default Workspaces;

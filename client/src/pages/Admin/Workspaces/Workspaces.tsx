import React, {useEffect, useState, FC} from 'react';
import useStyles from './Workspaces.style';
import {Button, Container, Grid, TextField} from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import Headline from '../../../components/Layout/components/Main/Headline/Headline';
import WorkspacesList from './WorkspacesList/WorkspacesList';
import {Autocomplete} from '@material-ui/lab';
import DeletionButton from '../../../components/Controls/DeletionButton/DeletionButton';
import {MessageType, useMessage} from '../../../components/Providers/MessageProvider';
import {LocationOption} from '../../../types';
import {useLocations, useToasterCatcher} from '../../../hooks';
import {LocationService} from '../../../services';

const Workspaces: FC = () => {
  const classes = useStyles();
  const {pushMessage} = useMessage();
  const blankLocation: LocationOption = {id: '', description: ''};
  const {locations, setLocations, locationsLoading, location, setLocation, fetchLocations} = useLocations();
  const [locationInput, setLocationInput] = useState<string>('');
  const {catchAndTossError} = useToasterCatcher();

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
    <Container maxWidth="lg" className={classes.container}>
      <Headline pagename="Manage Workspaces" />

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
          <Grid item xs={8}>
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
        </Grid>
      </Container>
      <WorkspacesList loc={location} />
    </Container>
  );
};

export default Workspaces;

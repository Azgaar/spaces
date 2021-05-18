import React, {FC, useEffect, useState} from 'react';
import useStyles from './ReserveWorkspace.style';
import {Box, Button, Chip, Input, FormControl, Grid, InputLabel, MenuItem, Select, TextField, CircularProgress, useMediaQuery, useTheme} from '@material-ui/core';
import {Autocomplete} from '@material-ui/lab';
import {Equipment, LocationOption, ReservationFilters, WorkspaceType, ReservationReq, ReservationRes, ServiceRes, ServiceReq} from '../../../types';
import {useDebounce, useLocations, useToasterCatcher, useUser} from '../../../hooks';
import AvailableWorkspaces from './AvailableWorkspaces/AvailableWorkspaces';
import {DateTimePicker} from '@material-ui/pickers';
import dayjs, {Dayjs} from 'dayjs';
import {getMaxDate, getStored} from '../../../utils';
import AddServices from './AddServices/AddServices';
import EquipmentIcon from '../../../components/Icons/EquipmentIcon/EquipmentIcon';
import {MessageType, useMessage} from '../../../components/Providers/MessageProvider';
import {ReservationService, RequestService} from '../../../services';
import {useFormik} from 'formik';
import {reserveValidationSchema} from '../../../validation/reserve';
import Content from '../../../components/Layout/components/Main/Content';

const blankLocation: LocationOption = {id: '', description: ''};
const from = dayjs().set('minute', 0).set('second', 0).set('millisecond', 0).add(1, 'hour');
const to = from.add(1, 'hour');

const ReserveWorkspace: FC = () => {
  const classes = useStyles();
  const {locations, locationsLoading, fetchLocations} = useLocations();
  const [workspaceId, setWorkspaceId] = useState<string>('');
  const [services, setServices] = useState<Services>({isOpen: false, list: []});
  const {pushMessage} = useMessage();
  const {user} = useUser();
  const {isLoading, setLoading, catchAndTossError} = useToasterCatcher();
  const [updateToggle, setUpdateToggle] = useState(false);
  const smallScreen = useMediaQuery(useTheme().breakpoints.down('xs'));

  useEffect(() => {
    fetchLocations({onlyWithWorkspaces: true});
    setLoading(() => false);
  }, []);

  const submitForm = async (values: ReservationFilters) => {
    const reservationData: ReservationReq = {
      from: values.from,
      to: values.to,
      location: values.location.id,
      requester: user.email,
      workspace: workspaceId
    };
    const addedReservation = (await catchAndTossError(ReservationService.add(reservationData))) as ReservationRes;
    if (addedReservation) {
      setWorkspaceId(() => '');
      setUpdateToggle((updateToggle) => !updateToggle); // trigger workspaces list update

      if (!services.list.length) {
        pushMessage({title: 'Workspace is reserved', type: MessageType.SUCCESS});
        return;
      }

      const requestData: ServiceReq = {
        location: values.location.id,
        reservationId: addedReservation.id,
        requester: user.email,
        servicesList: services.list
      };
      const addedServices = (await catchAndTossError(RequestService.add(requestData))) as ServiceRes[];
      if (addedServices) {
        pushMessage({title: 'Workspace is reserved, services are requested', type: MessageType.SUCCESS});
      } else {
        pushMessage({title: 'Workspace is reserved, but services request is failed', type: MessageType.ERROR});
      }
    }
  };

  const defaultFilters: ReservationFilters = {
    location: (getStored('location') as LocationOption) || blankLocation,
    type: 'Any',
    from: from.toISOString(),
    to: to.toISOString(),
    size: 1,
    equipment: [],
    description: ''
  };

  const formik = useFormik({
    initialValues: defaultFilters,
    validationSchema: reserveValidationSchema,
    onSubmit: submitForm
  });
  const debouncedFilters = useDebounce(formik.values, 500) as ReservationFilters;

  const handleLocationChange = (value: LocationOption | string | null) => {
    if (!value) {
      formik.setFieldValue('location', blankLocation);
    }
    if (!value || typeof value === 'string') {
      return;
    }

    formik.setFieldValue('location', value);
    localStorage.setItem('location', JSON.stringify(value));
  };

  const changeDate = (date: Dayjs | null, name: 'from' | 'to') => {
    if (date) {
      formik.setFieldValue(name, date.toISOString());
    }
  };

  const selectWorkspace = (selected: string) => {
    const newWorkspaceId = selected === workspaceId ? '' : selected;
    setWorkspaceId(() => newWorkspaceId);
  };

  const showServices = () => setServices((services) => ({...services, isOpen: true}));
  const closeServices = () => setServices((services) => ({...services, isOpen: false}));
  const addService = (service: string) => {
    if (services.list.find((item) => item === service)) {
      return;
    }
    setServices((services) => ({...services, list: [...services.list, service]}));
  };
  const deleteService = (service: string) => {
    setServices((services) => ({...services, list: services.list.filter((item) => item !== service)}));
  };

  return (
    <Content maxWidth="md" marginTop={smallScreen ? 0 : 10} pagename="Reserve Workspace">
      <form noValidate autoComplete="off" onSubmit={formik.handleSubmit}>
        <Grid container spacing={2}>
          <Grid item lg={4} sm={6} xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Autocomplete
                  id="location"
                  options={locations}
                  getOptionLabel={(option) => option.description}
                  value={formik.values.location}
                  onBlur={formik.handleBlur}
                  onChange={(e, value) => handleLocationChange(value)}
                  handleHomeEndKeys
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      name="location"
                      label="Location"
                      required
                      error={formik.touched.location && Boolean(formik.errors.location)}
                      helperText={formik.touched.location && formik.errors.location && formik.errors.location.id}
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
                <TextField select fullWidth id="type" name="type" label="Type" value={formik.values.type} onChange={formik.handleChange}>
                  <MenuItem value="Any" className={classes.typeAny}>
                    Any
                  </MenuItem>
                  {Object.values(WorkspaceType).map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={4}>
                <TextField
                  type="number"
                  required
                  fullWidth
                  id="size"
                  name="size"
                  label="Min size"
                  value={formik.values.size}
                  onChange={formik.handleChange}
                  error={Boolean(formik.errors.size)}
                  helperText={formik.errors.size}
                  InputProps={{inputProps: {max: 255, min: 1}}}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item lg={4} sm={6} xs={12}>
            <Grid container spacing={2}>
              <Grid item sm={12} xs={6}>
                <DateTimePicker
                  required
                  fullWidth
                  id="from"
                  name="from"
                  label="From"
                  value={formik.values.from}
                  onChange={(date) => changeDate(date, 'from')}
                  error={Boolean(formik.errors.from)}
                  helperText={formik.errors.from}
                  maxDate={getMaxDate()}
                  minutesStep={15}
                  disablePast={true}
                />
              </Grid>

              <Grid item sm={12} xs={6}>
                <DateTimePicker
                  required
                  fullWidth
                  id="to"
                  name="to"
                  label="To"
                  value={formik.values.to}
                  onChange={(date) => changeDate(date, 'to')}
                  error={Boolean(formik.errors.to)}
                  helperText={formik.errors.to}
                  minDate={formik.values.from}
                  minutesStep={15}
                  disablePast={true}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item lg={4} sm={12} xs={12}>
            <Grid container spacing={2}>
              <Grid item lg={12} sm={6} xs={6}>
                <TextField fullWidth id="description" name="description" label="Label" value={formik.values.description} onChange={formik.handleChange} />
              </Grid>

              <Grid item lg={12} sm={6} xs={6}>
                <FormControl className={classes.multiSelect}>
                  <InputLabel htmlFor="equipment">Equipment</InputLabel>
                  <Select
                    multiple
                    id="equipment"
                    name="equipment"
                    value={formik.values.equipment}
                    onChange={formik.handleChange}
                    input={<Input fullWidth />}
                    renderValue={(selected) => (
                      <div className={classes.chips}>
                        {(selected as string[]).map((value) => (
                          <Chip key={value} label={value} icon={<EquipmentIcon value={value as Equipment} />} className={classes.chip} />
                        ))}
                      </div>
                    )}>
                    {Object.values(Equipment).map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <AvailableWorkspaces filters={debouncedFilters} valid={formik.isValid} updateToggle={updateToggle} selectedWS={workspaceId} selectWorkspace={selectWorkspace} />

        <Box my={2}>
          <Grid container spacing={2}>
            <Grid item md={3} sm={6} xs={12}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                disabled={isLoading || !workspaceId || !formik.isValid}
                endIcon={isLoading && <CircularProgress size={20} />}>
                Reserve
              </Button>
            </Grid>
            <Grid item md={3} sm={6} xs={12}>
              <Button fullWidth variant="contained" color="secondary" onClick={showServices}>
                {services.list.length ? `Services: ${services.list.length}` : 'Request Services'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </form>

      <AddServices open={services.isOpen} services={services.list} onClose={closeServices} onAdd={addService} onDelete={deleteService} />
    </Content>
  );
};

type Services = {
  isOpen: boolean;
  list: string[];
};

export default ReserveWorkspace;

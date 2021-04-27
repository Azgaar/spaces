import React, {ChangeEvent, ChangeEventHandler, FormEvent, FormEventHandler, useEffect, useState} from "react";
import useStyles from "./ReserveWorkspace.style";
import {Button, Chip, Container, FilledInput, FormControl, Grid, InputLabel, MenuItem, Select, TextField} from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import {Autocomplete} from "@material-ui/lab";
import {Equipment, LocationOption, ReservationFilters, ReservationFilterErrors, WorkspaceType, ReservationReq, ReservationRes} from "../../../types";
import {useLocations, useToasterCatcher, useUser} from "../../../hooks";
import AvailableWorkspaces from "./AvailableWorkspaces/AvailableWorkspaces";
import {DateTimePicker} from "@material-ui/pickers";
import dayjs, {Dayjs} from "dayjs";
import {getMaxDate, getStored} from "../../../utils";
import Headline from "../../../components/Layout/components/Main/Headline/Headline";
import AddServices from "./AddServices/AddServices";
import EquipmentIcon from "../../../components/Icons/EquipmentIcon/EquipmentIcon";
import {MessageType, useMessage} from "../../../components/Providers/MessageProvider";
import {ReservationService, RequestService} from "../../../services";

const blankLocation: LocationOption = {id: "", description: ""};
const from = dayjs().set("minute", 0).set("second", 0).set("millisecond", 0).add(1, "hour");
const to = from.add(1, "hour");
const defaultFilters: ReservationFilters = {
  location: getStored("location") as LocationOption || blankLocation,
  type: "Any",
  from: from.toISOString(),
  to: to.toISOString(),
  size: 1,
  equipment: [],
  description: ""
};

function ReserveWorkspace() {
  const classes = useStyles();
  const {locations, locationsLoading, fetchLocations} = useLocations();
  const [filters, setFilters] = useState<ReservationFilters>(defaultFilters);
  const [filterErrors, setfilterErrors] = useState<ReservationFilterErrors>(validateFilters());
  const [workspaceId, setWorkspaceId] = useState<string>("");
  const [services, setServices] = useState<Services>({isOpen: false, list: []});
  const {pushMessage} = useMessage();
  const {user} = useUser();
  const {catchAndTossError} = useToasterCatcher();

  useEffect(() => {
    fetchLocations({onlyWithWorkspaces: true});
  }, []);

  useEffect(() => {
    const errors = validateFilters();
    setfilterErrors(() => errors);
  }, [filters]);

  function validateFilters(): ReservationFilterErrors {
    const errors: ReservationFilterErrors = {
      location: locations.length > 0 && !filters.location.id,
      from: !filters.from || filters.from > filters.to,
      to: !filters.to || filters.to <= filters.from,
      size: isNaN(filters.size) || filters.size < 1 || filters.size > 255
    };
    errors.errored = Object.values(errors).some(value => value);
    return errors;
  }

  const changeLocation = (location: LocationOption | string | null) => {
    if (!location) setFilters(filters => ({...filters, location: blankLocation}));
    if (!location || typeof location === "string") return;

    setFilters(filters => ({...filters, location}));
    localStorage.setItem("location", JSON.stringify(location));
  }

  const changeDate = (date: Dayjs | null, name: "from" | "to") => {
    date && setFilters(filters => ({...filters, [name]: date.toISOString()}));
  }

  const changeType: ChangeEventHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const type = e.target.value as WorkspaceType | "Any";
    setFilters(filters => ({...filters, type}));
  }

  const changeSize: ChangeEventHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const size = +e.target.value;
    setFilters(filters => ({...filters, size}));
  }

  const changeEquipment = (event: ChangeEvent<{value: unknown}>) => {
    const equipment = event.target.value as Equipment[];
    setFilters(filters => ({...filters, equipment}));
  }

  const changeWorkspaceDescription: ChangeEventHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const description = e.target.value;
    setFilters(filters => ({...filters, description}));
  }

  const selectWorkspace = (selected: string) => {
    const newWorkspaceId = selected === workspaceId ? "" : selected;
    setWorkspaceId(() => newWorkspaceId);
  }

  const handleSubmit: FormEventHandler = async (e: FormEvent) => {
    e.preventDefault();
    if (filterErrors.errored || !workspaceId) return;

    const requestData: ReservationReq = {from: filters.from, to: filters.to, location: filters.location.id, requester: user.email, workspace: workspaceId};
    const addedReservation: ReservationRes = await catchAndTossError(ReservationService.add(requestData));
    if (!addedReservation) return;

    pushMessage({title: "Workspace is reserved", type: MessageType.SUCCESS});
    setWorkspaceId(() => "");
    setFilters(() => ({...filters})); // trigger workspaces list update

    if (!services.list.length) return;
    const addedRequests = await catchAndTossError(RequestService.add(addedReservation.id, user.email, services.list));
    if (addedRequests) pushMessage({title: "Workspace is reserved, services are requested", type: MessageType.SUCCESS});
    else pushMessage({title: "Workspace is reserved, but services request is failed", type: MessageType.ERROR});
  }

  const showServices = () => setServices(services => ({...services, isOpen: true}));
  const closeServices = () => setServices(services => ({...services, isOpen: false}));
  const addService = (service: string) => {
    if (services.list.find(item => item === service)) return;
    setServices(services => ({...services, list: [...services.list, service]}));
  }
  const deleteService = (service: string) => {
    setServices(services => ({...services, list: services.list.filter(item => item !== service)}))
  };

  return (
    <Container maxWidth="lg" className={classes.container}>
      <Headline pagename="Reserve Workspace" />

      <Container className={classes.form} maxWidth="lg">
        <form noValidate autoComplete="off" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item lg={4} sm={6} xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Autocomplete id="locations" options={locations} getOptionLabel={option => option.description}
                    value={filters.location} onChange={(e, value) => changeLocation(value)} handleHomeEndKeys renderInput={(params) => (
                      <TextField {...params} variant="filled" label="Location" required error={filterErrors.location}
                        InputProps={{...params.InputProps, endAdornment: (<>
                          {locationsLoading && <CircularProgress color="inherit" size={20} />}
                          {params.InputProps.endAdornment}
                        </>),
                    }}/>
                  )} />
                </Grid>

                <Grid item xs={8}>
                  <TextField select variant="filled" fullWidth id="type" label="Type"
                    value={filters.type} onChange={changeType} >
                    <MenuItem value="Any" className={classes.typeAny}>Any</MenuItem>
                    {Object.values(WorkspaceType).map((option) => <MenuItem key={option} value={option}>{option}</MenuItem>)}
                  </TextField>
                </Grid>

                <Grid item xs={4}>
                  <TextField type="number" variant="filled" required fullWidth id="size" label="Min size"
                    value={filters.size} error={filterErrors.size} InputProps={{inputProps: {max: 255, min: 1}}} onChange={changeSize} />
                </Grid>
              </Grid>
            </Grid>

            <Grid item lg={4} sm={6} xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <DateTimePicker required fullWidth id="from" label="From" inputVariant="filled" error={filterErrors.from}
                    value={filters.from} maxDate={getMaxDate()} minutesStep={15} disablePast={true} onChange={(date) => changeDate(date, "from")} />
                </Grid>

                <Grid item xs={12}>
                  <DateTimePicker required fullWidth id="to" label="To" inputVariant="filled" error={filterErrors.to}
                    value={filters.to} minDate={filters.from} minutesStep={15} disablePast={true} onChange={(date) => changeDate(date, "to")} />
                </Grid>
              </Grid>
            </Grid>

            <Grid item lg={4} sm={12} xs={12}>
              <Grid container spacing={2}>
                <Grid item lg={12} sm={6} xs={12}>
                  <TextField variant="filled" fullWidth id="description" label="Label"
                    value={filters.description} onChange={changeWorkspaceDescription} />
                </Grid>

                <Grid item lg={12} sm={6} xs={12}>
                  <FormControl variant="filled" className={classes.multiSelect}>
                    <InputLabel htmlFor="equipment">Equipment</InputLabel>
                    <Select multiple id="equipment" value={filters.equipment} input={<FilledInput fullWidth />}
                      onChange={changeEquipment} renderValue={selected =>
                        <div className={classes.chips}>
                          {(selected as string[]).map(value => (
                            <Chip key={value} label={value} icon={<EquipmentIcon value={value as Equipment} />} className={classes.chip} />
                          ))}
                        </div>
                      } >
                      {Object.values(Equipment).map((option) => <MenuItem key={option} value={option}>{option}</MenuItem>)}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <AvailableWorkspaces filters={filters} errored={filterErrors.errored} selectedWS={workspaceId} selectWorkspace={selectWorkspace} />

          <Grid container spacing={2} className={classes.controls}>
            <Grid item lg={2} md={3} sm={4} xs={12}>
              <Button type="submit" fullWidth variant="contained" color="primary" disabled={!workspaceId || filterErrors.errored}>Reserve</Button>
            </Grid>
            <Grid item lg={2} md={3} sm={4} xs={12}>
              <Button fullWidth variant="contained" color="secondary" onClick={showServices}>
                {services.list.length ? `Services: ${services.list.length}` : "Add Services"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Container>

      <AddServices open={services.isOpen} services={services.list} onClose={closeServices} onAdd={addService} onDelete={deleteService}/>
    </Container>
  );
}

type Services = {
  isOpen: boolean;
  list: string[];
}

export default ReserveWorkspace;

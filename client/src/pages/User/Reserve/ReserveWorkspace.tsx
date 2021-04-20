import React, {ChangeEvent, ChangeEventHandler, FormEvent, FormEventHandler, useEffect, useState} from "react";
import useStyles from "./ReserveWorkspace.style";
import {Avatar, Button, Container, Grid, MenuItem, TextField, Typography} from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import CollectionsBookmarkIcon from "@material-ui/icons/CollectionsBookmark";
import {Autocomplete} from "@material-ui/lab";
import {Equipment, LocationOption, WorkspaceType} from "../../../types";
import {useToasterCatcher} from "../../../hooks";
import {LocationService} from "../../../services";
import AvailableWorkspaces from "./AvailableWorkspaces/AvailableWorkspaces";
import {DateTimePicker} from "@material-ui/pickers";
import dayjs, {Dayjs} from "dayjs";
import {getMaxDate} from "../../../utils";

type ReservationForm = {
  location: LocationOption;
  workspace: string;
  from: string;
  to: string;
  size: number;
  type: WorkspaceType,
  equipment: Equipment[]
}

type ReservationFormErrors = {
  location: boolean;
  workspace: boolean;
  from: boolean;
  to: boolean;
  size: boolean;
  type: boolean,
  equipment: boolean
}

function ReserveWorkspace() {
  const classes = useStyles();
  const [locationList, setLocationList] = useState<LocationOption[]>([]);
  const {isLoading, catchAndTossError} = useToasterCatcher();

  const from = dayjs().set("minute", 0).set("second", 0).set("millisecond", 0).add(1, "hour");
  const to = from.add(1, "hour");
  const defaultFormData: ReservationForm = {
    location: {id: "", description: ""},
    workspace: "",
    from: from.toISOString(),
    to: to.toISOString(),
    size: 1,
    type: WorkspaceType.DESK,
    equipment: []
  };
  const [formData, setFormData] = useState<ReservationForm>(defaultFormData);
  const [formErrors, setFormErrors] = useState<ReservationFormErrors>({} as ReservationFormErrors);

  useEffect(() => {
    async function fetchLocations() {
      const allLocations: LocationOption[] = await catchAndTossError(LocationService.list({onlyWithWorkspaces: true}));
      if (!allLocations) return;

      setLocationList(() => allLocations);
      const stored = localStorage.getItem("location");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (allLocations.find(loc => loc.id === parsed.id)) {
          setFormData(formData => ({...formData, location: parsed}));
        }
        else localStorage.removeItem("location");
      }
    };
    fetchLocations();
  }, []);

  const changeLocation = (location: LocationOption | string | null) => {
    if (!location) setFormData(formData => ({...formData, location: {id: "", description: ""}}));
    if (!location || typeof location === "string") return;

    setFormData(formData => ({...formData, location}));
    localStorage.setItem("location", JSON.stringify(location));
  }

  const changeDate = (date: Dayjs | null, name: "from" | "to") => {
    if (!date) return;
    const dateString = date.toISOString();

    const fromError = name === "from" && dateString >= formData.to;
    const toError = name === "to" && dateString <= formData.from;
    setFormErrors(errors => ({...errors, from: fromError, to: toError}));
    setFormData(formData => ({...formData, [name]: dateString}));
  }

  const changeType: ChangeEventHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const type = e.target.value as WorkspaceType;
    const error = !type;
    setFormErrors(errors => ({...errors, type: error}));
    setFormData(formData => ({...formData, type}));
  }

  const changeSize: ChangeEventHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const size = +e.target.value;
    const error = isNaN(size) || size < 1 || size > 256;
    setFormErrors(errors => ({...errors, size: error}));
    setFormData(formData => ({...formData, size}));
  }

  const handleSubmit: FormEventHandler = (e: FormEvent): void => {
    e.preventDefault();

    console.log("Errors: ", formErrors);
    console.log(formData);
  }

  return (
    <Container maxWidth="lg" className={classes.container}>
      <Avatar className={classes.avatar}>
        <CollectionsBookmarkIcon />
      </Avatar>
      <Typography component="h1" variant="h5">Reserve Workspace</Typography>

      <Container className={classes.form} maxWidth="lg">
        <form noValidate autoComplete="off" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item lg={3} sm={6} xs={12}>
              <Autocomplete id="locations" options={locationList} getOptionLabel={option => option.description}
                value={formData.location} onChange={(e, value) => changeLocation(value)} handleHomeEndKeys renderInput={(params) => (
                  <TextField {...params} variant="outlined" label="Select Location" InputProps={{...params.InputProps, endAdornment: (
                    <>
                      {isLoading && <CircularProgress color="inherit" size={20} />}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}/>
              )} />
            </Grid>

            <Grid item lg={2} sm={4} xs={8}>
              <TextField select variant="outlined" required fullWidth id="type" label="Type" name="type"
                value={formData.type} error={formErrors.type} onChange={changeType} >
                {Object.values(WorkspaceType).map((option) => <MenuItem key={option} value={option}>{option}</MenuItem>)}
              </TextField>
            </Grid>

            <Grid item lg={1} sm={2} xs={4}>
              <TextField type="number" variant="outlined" required fullWidth id="size" label="Size" name="size"
                value={formData.size} error={formErrors.size} InputProps={{inputProps: {max: 256, min: 1}}} onChange={changeSize} />
            </Grid>

            <Grid item lg={3} sm={6} xs={12}>
              <DateTimePicker required fullWidth id="from" label="From" name="from" inputVariant="outlined" error={formErrors.from}
                value={formData.from} maxDate={getMaxDate()} minutesStep={15} disablePast={true} onChange={(date) => changeDate(date, "from")} />
            </Grid>

            <Grid item lg={3} sm={6} xs={12}>
              <DateTimePicker required fullWidth id="to" label="To" name="to" inputVariant="outlined" error={formErrors.to}
                value={formData.to} minDate={formData.from} minutesStep={15} disablePast={true} onChange={(date) => changeDate(date, "to")} />
            </Grid>

            <Grid item xs={12}>
              <AvailableWorkspaces />
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item lg={2} md={3} sm={6} xs={12}>
              <Button type="submit" fullWidth variant="contained" color="primary">Reserve</Button>
            </Grid>
          </Grid>
        </form>
      </Container>
    </Container>
  );
}

export default ReserveWorkspace;

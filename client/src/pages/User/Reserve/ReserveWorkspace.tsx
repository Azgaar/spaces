import React, {useEffect, useState} from "react";
import useStyles from "./ReserveWorkspace.style";
import {Avatar, Button, Container, Grid, MenuItem, TextField, Typography} from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import CollectionsBookmarkIcon from "@material-ui/icons/CollectionsBookmark";
import {Autocomplete} from "@material-ui/lab";
import {Equipment, LocationOption, WorkspaceType} from "../../../types";
import {useToasterCatcher, useUser} from "../../../hooks";
import {LocationService} from "../../../services";
import AvailableWorkspaces from "./AvailableWorkspaces/AvailableWorkspaces";
import {Controller, useForm} from "react-hook-form";
import {DateTimePicker} from "@material-ui/pickers";
import dayjs, {Dayjs} from "dayjs";
import {getMaxDate} from "../../../utils";
import {rules} from "../../../validation/reservation";

type ReservationSearchForm = {
  location: string;
  workspace: string;
  requester: string;
  from: string;
  to: string;
  size: number;
  type: WorkspaceType,
  equipment: Equipment[]
}

function ReserveWorkspace() {
  const classes = useStyles();
  const locationDefault: LocationOption = {id: "", description: ""};
  const [location, setLocation] = useState<LocationOption>(locationDefault);
  const [locationList, setLocationList] = useState<LocationOption[]>([]);
  const {isLoading, catchAndTossError} = useToasterCatcher();
  const {register, reset, errors, getValues, setValue, control, handleSubmit} = useForm<ReservationSearchForm>();
  const {user} = useUser();

  const from = dayjs().set("minute", 0).set("second", 0).set("millisecond", 0).add(1, "hour");
  const to = from.add(1, "hour");
  const defaults: ReservationSearchForm = {
    requester: user.email,
    location: location.description,
    workspace: "",
    from: from.toISOString(),
    to: to.toISOString(),
    size: 1,
    type: WorkspaceType.DESK,
    equipment: []
  };

  useEffect(() => {
    async function fetchLocations() {
      const allLocations: LocationOption[] = await catchAndTossError(LocationService.list({onlyWithWorkspaces: true}));
      if (!allLocations) return;

      setLocationList(() => allLocations);
      const stored = localStorage.getItem("location");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (allLocations.find(loc => loc.id === parsed.id)) {
          setLocation(() => parsed);
          reset({location: parsed.id});
        }
        else localStorage.removeItem("location");
      }
    };
    fetchLocations();
  }, []);

  useEffect(() => {
    reset({type: defaults.type, equipment: defaults.equipment});
  }, []);

  const handleLocationChange = (value: LocationOption | string | null) => {
    if (!value) setLocation(() => locationDefault);
    if (!value || typeof value === "string") return;

    setLocation(() => value);
    localStorage.setItem("location", JSON.stringify(value));
  }

  const changeDate = (date: Dayjs | null, name: "from" | "to") => {
    if (!date) return;
    const dateString = date.toISOString();
    setValue(name, dateString);
  }

  const submit = (formData: ReservationSearchForm) => {
    console.log(formData);
  }

  return (
    <Container maxWidth="lg" className={classes.container}>
      <Avatar className={classes.avatar}>
        <CollectionsBookmarkIcon />
      </Avatar>
      <Typography component="h1" variant="h5">Reserve Workspace</Typography>

      <Container className={classes.form} maxWidth="lg">
        <form noValidate autoComplete="off" onSubmit={handleSubmit(submit)}>
          <Grid container spacing={2}>
            <Grid item lg={3} sm={6} xs={12}>
              <Autocomplete id="locations" value={location} options={locationList} getOptionLabel={option => option.description}
                onChange={(e, value) => handleLocationChange(value)} handleHomeEndKeys renderInput={(params) => (
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
                defaultValue={defaults.type} inputRef={register(rules.type)} error={Boolean(errors.type)} 
                onChange={e => setValue("type", e.target.value)} >
                {Object.values(WorkspaceType).map((option) => <MenuItem key={option} value={option}>{option}</MenuItem>)}
              </TextField>
            </Grid>

            <Grid item lg={1} sm={2} xs={4}>
              <TextField type="number" variant="outlined" required fullWidth id="size" label="Size" name="size"
                InputProps={{inputProps: {max: 256, min: 1}}}
                defaultValue={defaults.size} inputRef={register(rules.size)} error={Boolean(errors.size)} />
            </Grid>

            <Grid item lg={3} sm={6} xs={12}>
              <Controller control={control} name="from" defaultValue={defaults.from} rules={{validate: ((value) => value < getValues("to"))}} render={({ref, value}) => (
                <DateTimePicker required fullWidth id="from" label="From" name="from" inputVariant="outlined" error={Boolean(errors.from)}
                maxDate={getMaxDate()} minutesStep={15} disablePast={true} value={value} onChange={(date) => changeDate(date, "from")} inputRef={ref} />
              )} />
            </Grid>

            <Grid item lg={3} sm={6} xs={12}>
              <Controller control={control} name="to" defaultValue={defaults.to} rules={{validate: ((value) => value > getValues("from"))}} render={({ref, value}) => (
                <DateTimePicker required fullWidth id="to" label="To" name="to" inputVariant="outlined" error={Boolean(errors.to)}
                  minDate={defaults.from} minutesStep={15} disablePast={true} value={value} onChange={(date) => changeDate(date, "to")} inputRef={ref} />
              )} />
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

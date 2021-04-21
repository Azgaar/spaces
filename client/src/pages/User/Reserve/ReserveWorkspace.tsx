import React, {ChangeEvent, ChangeEventHandler, FormEvent, FormEventHandler, useEffect, useState} from "react";
import useStyles from "./ReserveWorkspace.style";
import {Button, Chip, Container, Grid, InputLabel, MenuItem, Select, TextField} from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import {Autocomplete} from "@material-ui/lab";
import {Equipment, LocationOption, WorkspaceType} from "../../../types";
import {useLocations} from "../../../hooks";
import AvailableWorkspaces from "./AvailableWorkspaces/AvailableWorkspaces";
import {DateTimePicker} from "@material-ui/pickers";
import dayjs, {Dayjs} from "dayjs";
import {getMaxDate} from "../../../utils";
import Headline from "../../../components/Layout/components/Main/Headline/Headline";
import EquipmentIcon from "../../../components/Icons/EquipmentIcon/EquipmentIcon";

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
  const {locations, locationsLoading, defaultLocation, fetchLocations} = useLocations();

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
    fetchLocations({onlyWithWorkspaces: true});
  }, []);

  useEffect(() => {
    setFormData(formData => ({...formData, location: defaultLocation}));
  }, [defaultLocation]);

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

  const changeEquipment = (event: ChangeEvent<{value: unknown}>) => {
    const equipment = event.target.value as Equipment[];
    setFormData(formData => ({...formData, equipment}));
  }

  const handleSubmit: FormEventHandler = (e: FormEvent): void => {
    e.preventDefault();

    console.log("Errors: ", formErrors);
    console.log(formData);
  }

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
                    value={formData.location} onChange={(e, value) => changeLocation(value)} handleHomeEndKeys renderInput={(params) => (
                      <TextField {...params} variant="outlined" label="Location" required InputProps={{...params.InputProps, endAdornment: (
                        <>
                          {locationsLoading && <CircularProgress color="inherit" size={20} />}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}/>
                  )} />
                </Grid>

                <Grid item xs={8}>
                  <TextField select variant="outlined" required fullWidth id="type" label="Type" name="type"
                    value={formData.type} error={formErrors.type} onChange={changeType} >
                    {Object.values(WorkspaceType).map((option) => <MenuItem key={option} value={option}>{option}</MenuItem>)}
                  </TextField>
                </Grid>

                <Grid item xs={4}>
                  <TextField type="number" variant="outlined" required fullWidth id="size" label="Size" name="size"
                    value={formData.size} error={formErrors.size} InputProps={{inputProps: {max: 256, min: 1}}} onChange={changeSize} />
                </Grid>
              </Grid>
            </Grid>

            <Grid item lg={4} sm={6} xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <DateTimePicker required fullWidth id="from" label="From" name="from" inputVariant="outlined" error={formErrors.from}
                    value={formData.from} maxDate={getMaxDate()} minutesStep={15} disablePast={true} onChange={(date) => changeDate(date, "from")} />
                </Grid>

                <Grid item xs={12}>
                  <DateTimePicker required fullWidth id="to" label="To" name="to" inputVariant="outlined" error={formErrors.to}
                    value={formData.to} minDate={formData.from} minutesStep={15} disablePast={true} onChange={(date) => changeDate(date, "to")} />
                </Grid>
              </Grid>
            </Grid>

            <Grid item lg={4} sm={6} xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <InputLabel id="equipmentLabel" className={classes.label}>Equipment</InputLabel>
                  <Select multiple fullWidth id="equipment" labelId="equipmentLabel" labelWidth={0} variant="outlined"
                    value={formData.equipment} error={formErrors.equipment} renderValue={selected =>
                      <div className={classes.chips}>
                        {(selected as string[]).map(value => (
                          <Chip key={value} label={value} icon={<EquipmentIcon value={value as Equipment} />} className={classes.chip} />
                        ))}
                      </div>
                    } onChange={changeEquipment} >
                    {Object.values(Equipment).map((option) => <MenuItem key={option} value={option}>{option}</MenuItem>)}
                  </Select>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid container spacing={2}>
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

import React, {ChangeEvent, ChangeEventHandler, FormEvent, FormEventHandler, useEffect, useState} from "react";
import useStyles from "./ReserveWorkspace.style";
import {Button, Chip, Container, FilledInput, FormControl, Grid, InputLabel, MenuItem, Select, TextField} from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import {Autocomplete} from "@material-ui/lab";
import {Equipment, LocationOption, ReservationForm, ReservationFormErrors, WorkspaceType} from "../../../types";
import {useLocations} from "../../../hooks";
import AvailableWorkspaces from "./AvailableWorkspaces/AvailableWorkspaces";
import {DateTimePicker} from "@material-ui/pickers";
import dayjs, {Dayjs} from "dayjs";
import {getMaxDate} from "../../../utils";
import Headline from "../../../components/Layout/components/Main/Headline/Headline";
import EquipmentIcon from "../../../components/Icons/EquipmentIcon/EquipmentIcon";

const from = dayjs().set("minute", 0).set("second", 0).set("millisecond", 0).add(1, "hour");
const to = from.add(1, "hour");
const defaultFormData: ReservationForm = {
  location: {id: "", description: ""},
  type: "Any",
  workspace: "",
  from: from.toISOString(),
  to: to.toISOString(),
  size: 1,
  equipment: [],
  description: ""
};

function ReserveWorkspace() {
  const classes = useStyles();
  const {locations, locationsLoading, defaultLocation, fetchLocations} = useLocations();
  const [formData, setFormData] = useState<ReservationForm>(defaultFormData);
  const [formErrors, setFormErrors] = useState<ReservationFormErrors>(validateForm());

  useEffect(() => {
    fetchLocations({onlyWithWorkspaces: true});
  }, []);

  useEffect(() => {
    setFormData(formData => ({...formData, location: defaultLocation}));
  }, [defaultLocation]);

  useEffect(() => {
    const errors = validateForm();
    setFormErrors(() => errors);
  }, [formData]);

  function validateForm(): ReservationFormErrors {
    return {
      location: locations.length > 0 && !formData.location.id,
      workspace: !formData.workspace,
      from: !formData.from || formData.from > formData.to,
      to: !formData.to || formData.to <= formData.from,
      size: isNaN(formData.size) || formData.size < 1 || formData.size > 255
    };
  }

  const changeLocation = (location: LocationOption | string | null) => {
    if (!location) setFormData(formData => ({...formData, location: {id: "", description: ""}}));
    if (!location || typeof location === "string") return;

    setFormData(formData => ({...formData, location}));
    localStorage.setItem("location", JSON.stringify(location));
  }

  const changeDate = (date: Dayjs | null, name: "from" | "to") => {
    date && setFormData(formData => ({...formData, [name]: date.toISOString()}));
  }

  const changeType: ChangeEventHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const type = e.target.value as WorkspaceType | "Any";
    setFormData(formData => ({...formData, type}));
  }

  const changeSize: ChangeEventHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const size = +e.target.value;
    setFormData(formData => ({...formData, size}));
  }

  const changeEquipment = (event: ChangeEvent<{value: unknown}>) => {
    const equipment = event.target.value as Equipment[];
    setFormData(formData => ({...formData, equipment}));
  }

  const changeWorkspaceDescription: ChangeEventHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const description = e.target.value;
    setFormData(formData => ({...formData, description}));
  }

  const changeWorkspace = (workspaceId: string) => {
    setFormData(formData => ({...formData, workspace: workspaceId}));
  }

  const handleSubmit: FormEventHandler = (e: FormEvent): void => {
    e.preventDefault();
    console.log({formErrors}, {formData});
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
                      <TextField {...params} variant="filled" label="Location" required error={formErrors.location}
                        InputProps={{...params.InputProps, endAdornment: (<>
                          {locationsLoading && <CircularProgress color="inherit" size={20} />}
                          {params.InputProps.endAdornment}
                        </>),
                    }}/>
                  )} />
                </Grid>

                <Grid item xs={8}>
                  <TextField select variant="filled" fullWidth id="type" label="Type"
                    value={formData.type} onChange={changeType} >
                    <MenuItem value="Any" className={classes.typeAny}>Any</MenuItem>
                    {Object.values(WorkspaceType).map((option) => <MenuItem key={option} value={option}>{option}</MenuItem>)}
                  </TextField>
                </Grid>

                <Grid item xs={4}>
                  <TextField type="number" variant="filled" required fullWidth id="size" label="Min size"
                    value={formData.size} error={formErrors.size} InputProps={{inputProps: {max: 255, min: 1}}} onChange={changeSize} />
                </Grid>
              </Grid>
            </Grid>

            <Grid item lg={4} sm={6} xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <DateTimePicker required fullWidth id="from" label="From" inputVariant="filled" error={formErrors.from}
                    value={formData.from} maxDate={getMaxDate()} minutesStep={15} disablePast={true} onChange={(date) => changeDate(date, "from")} />
                </Grid>

                <Grid item xs={12}>
                  <DateTimePicker required fullWidth id="to" label="To" inputVariant="filled" error={formErrors.to}
                    value={formData.to} minDate={formData.from} minutesStep={15} disablePast={true} onChange={(date) => changeDate(date, "to")} />
                </Grid>
              </Grid>
            </Grid>

            <Grid item lg={4} sm={12} xs={12}>
              <Grid container spacing={2}>
                <Grid item lg={12} sm={6} xs={12}>
                  <TextField variant="filled" fullWidth id="description" label="Label"
                    value={formData.description} onChange={changeWorkspaceDescription} />
                </Grid>

                <Grid item lg={12} sm={6} xs={12}>
                  <FormControl variant="filled" className={classes.multiSelect}>
                    <InputLabel htmlFor="equipment">Equipment</InputLabel>
                    <Select multiple id="equipment" value={formData.equipment} input={<FilledInput fullWidth />}
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

          <AvailableWorkspaces formData={formData} formErrors={formErrors} selected={formData.workspace} onClick={changeWorkspace} />

          <Grid container spacing={2}>
            <Grid item lg={2} md={3} sm={6} xs={12}>
              <Button type="submit" fullWidth variant="contained" color="primary" disabled={Object.values(formErrors).some(value => value)}>Reserve</Button>
            </Grid>
          </Grid>
        </form>
      </Container>
    </Container>
  );
}

export default ReserveWorkspace;

import React, {useEffect, useState} from "react";
import useStyles from "./ReservationDialog.style";
import {Avatar, TextField, Button, Typography, Grid, Container, Dialog, MenuItem, FormControl} from "@material-ui/core";
import CollectionsBookmarkIcon from "@material-ui/icons/CollectionsBookmark";
import {Controller, SubmitHandler, useForm} from "react-hook-form";
import {rules} from "../../../../validation/reservation";
import {ReservationReq, UserData, Workspace} from "../../../../types";
import {useToasterCatcher} from "../../../../hooks";
import {UserService, WorkspaceService} from "../../../../services";
import {DateTimePicker} from "@material-ui/pickers";
import {Dayjs} from "dayjs";

type Props = {
  mode: "Add" | "Edit";
  reservation: ReservationReq;
  close: () => void;
  submit: (formData: ReservationReq) => void;
}

const getMaxDate = () => {
  const date = new Date();
  const month = date.getMonth();
  const year = date.getFullYear();
  const yearEnd = "12-31-" + (month > 10 ? year+1 : year);
  return yearEnd;
}
const MAX_DATE = getMaxDate();

const ReservationDialog = ({mode, reservation, close, submit}: Props) => {
  const {from, to, workspace, location, requester} = reservation;
  const [slot, setSlot] = useState<{from: Date, to: Date}>({from, to});
  const classes = useStyles();
  const {errors, setValue, getValues, control, handleSubmit} = useForm<ReservationReq>();
  const [freeWorkspaces, setFreeWorkspaces] = useState<Workspace[]>([]);
  const [users, setUsers] = useState<UserData[]>([]);
  const {isLoading, catchAndTossError} = useToasterCatcher();

  useEffect(() => {
    async function fetchWorkspaces() {
      const freeWorkspaces: Workspace[] = await catchAndTossError(WorkspaceService.find(location, slot.from, slot.to));
      if (freeWorkspaces) setFreeWorkspaces(() => freeWorkspaces);
    };
    if (!errors.from && !errors.to) fetchWorkspaces();
  }, [slot]);

  useEffect(() => {
    async function fetchUsers() {
      const users: UserData[] = await catchAndTossError(UserService.list());
      if (users) setUsers(() => users);
    };
    fetchUsers();
  }, []);

  const getLabel = (ws: Workspace) => {
    let label = `${ws.description}: ${ws.type} [${ws.size}]`;
    if (ws.equipment.length) label += " with " + ws.equipment.join(", ");
    return label;
  }

  const onSubmit: SubmitHandler<ReservationReq> = async (formData: ReservationReq) => {
    console.log(formData);
    submit(formData);
  };

  const changeDate = (date: Dayjs | null, name: "from" | "to") => {
    if (!date) return;
    const dateObj = date.toDate();
    const {from, to} = name === "from" ? {to: slot.to, from: dateObj} : {from: slot.from, to: dateObj};
    setSlot(() => ({from, to}));
    setValue(name, dateObj);
  }

  return (
    <Dialog open onClose={close} aria-labelledby="form-dialog-title">
      <Container maxWidth="xs" className={classes.paper}>
        <Avatar className={classes.avatar}>
          <CollectionsBookmarkIcon />
        </Avatar>
        <Typography component="h1" variant="h5">{mode} Reservation</Typography>

        <form className={classes.form} noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
          <FormControl>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Controller control={control} name="from" defaultValue={from} rules={{validate: (value => value < getValues("to"))}} render={({ref, value}) => (
                  <DateTimePicker required fullWidth id="from" label="From" name="from" inputVariant="outlined" error={Boolean(errors.from)}
                  maxDate={MAX_DATE} minutesStep={15} disablePast={true} value={value} onChange={(date) => changeDate(date, "from")} inputRef={ref} />
                )} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller control={control} name="to" defaultValue={to} rules={{validate: (value => value > getValues("from"))}} render={({ref, value}) => (
                  <DateTimePicker required fullWidth id="to" label="To" name="to" inputVariant="outlined" error={Boolean(errors.to)}
                    minDate={slot.from} minutesStep={15} disablePast={true} value={value} onChange={(date) => changeDate(date, "to")} inputRef={ref} />
                )} />
              </Grid>

              <Grid item xs={12} sm={12}>
                <Controller control={control} name="workspace" defaultValue={workspace} rules={rules.workspace} as={
                  <TextField select variant="outlined" required fullWidth autoFocus id="workspace" label="Workspace" name="workspace"
                    error={Boolean(errors.workspace)} helperText={errors.workspace?.message} disabled={isLoading || !freeWorkspaces.length} >
                    {freeWorkspaces.length
                      ? Object.values(freeWorkspaces).map((ws) => <MenuItem key={ws.id} value={ws.id}>{getLabel(ws)}</MenuItem>)
                      : (<MenuItem key="N/A" value="">No free workspaces</MenuItem>)}
                  </TextField>
                } />
              </Grid>

              <Grid item xs={12} sm={12}>
                <Controller control={control} name="requester" defaultValue={requester} rules={rules.requester} as={
                  <TextField select variant="outlined" required fullWidth id="requester" label="Request for" name="requester"
                  error={Boolean(errors.requester)} helperText={errors.requester?.message} >
                    {users.map((user) => <MenuItem key={user.email} value={user.email}>{user.email}</MenuItem>)}
                  </TextField>
                } />
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} className={classes.buttons}>
                <Button type="submit" fullWidth variant="contained" color="primary">Save</Button>
              </Grid>
              <Grid item xs={12} sm={6} className={classes.buttons}>
                <Button fullWidth variant="contained" color="primary" onClick={close}>Close</Button>
              </Grid>
            </Grid>
          </FormControl>
        </form>
      </Container>
    </Dialog>
  );
}

export default ReservationDialog;

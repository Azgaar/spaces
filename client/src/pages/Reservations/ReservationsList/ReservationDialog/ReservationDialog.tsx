import React, {useEffect, useState} from "react";
import useStyles from "./ReservationDialog.style";
import {Avatar, TextField, Button, Typography, Grid, Container, Dialog, MenuItem, FormControl, FormHelperText} from "@material-ui/core";
import CollectionsBookmarkIcon from "@material-ui/icons/CollectionsBookmark";
import {Controller, SubmitHandler, useForm} from "react-hook-form";
import {rules} from "../../../../validation/reservation";
import {ReservationReq, Workspace} from "../../../../types";
import {useToasterCatcher} from "../../../../hooks";
import {WorkspaceService} from "../../../../services";
import {DateTimePicker} from "@material-ui/pickers";
import {Dayjs} from "dayjs";

type Props = {
  mode: "Add" | "Edit";
  reservation: ReservationReq;
  close: () => void;
  submit: (formData: ReservationReq) => void;
}

const ReservationDialog = ({mode, reservation, close, submit}: Props) => {
  const {from, to, workspace, location, requester} = reservation;
  const [slot, setSlot] = useState<{from: Date, to: Date}>({from, to});
  const [status, setStatus] = useState<string>("Select a workspace");
  const classes = useStyles();
  const {formState, errors, setError, setValue, control, handleSubmit} = useForm<ReservationReq>();
  const [freeWorkspaces, setFreeWorkspaces] = useState([] as Workspace[]);
  const {isLoading, catchAndTossError} = useToasterCatcher();

  useEffect(() => {
    async function fetchWorkspaces() {
      const freeWorkspaces: Workspace[] = await catchAndTossError(WorkspaceService.find(location, slot.from, slot.to));
      if (freeWorkspaces) setFreeWorkspaces(() => freeWorkspaces);
      console.log("fetchWorkspaces", freeWorkspaces);
    };
    fetchWorkspaces();
  }, [slot]);

  const getLabel = (ws: Workspace) => {
    let label = `${ws.description}: ${ws.type} [${ws.size}]`;
    if (ws.equipment.length) label += " with " + ws.equipment.join(", ");
    return label;
  }

  const onSubmit: SubmitHandler<ReservationReq> = async (formData: ReservationReq) => {
    console.log({from, to, workspace, requester}, formData, formState);
    if (formData.from >= formData.to) {
      setError("to", {type: "manual", message: "Revervation end date must be greater than start date"});
      return;
    }
    submit(formData);
  };

  const changeDate = (date: Dayjs | null, name: "from" | "to") => {
    if (!date) return;
    const dateObj = date.toDate();
    const {from, to} = name === "from" ? {to: slot.to, from: dateObj} : {from: slot.from, to: dateObj};

    if (from >= to) {
      setStatus(() => "From must be before to");
      return;
    }

    if (to < from) {
      setStatus(() => "To must be after from");
      return;
    }

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
                <Controller control={control} name="from" defaultValue={from} rules={rules.from} render={({ref, value}) => (
                  <DateTimePicker required fullWidth id="from" label="From" name="from" inputVariant="outlined" error={Boolean(errors.from)}
                    showTodayButton minutesStep={15} disablePast={true} value={value} onChange={(date) => changeDate(date, "from")} inputRef={ref} />
                )} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller control={control} name="to" defaultValue={to} rules={rules.to} render={({onChange, ref, value}) => (
                  <DateTimePicker required fullWidth id="to" label="To" name="to" inputVariant="outlined" error={Boolean(errors.to)}
                    showTodayButton minutesStep={15} disablePast={true} value={value} onChange={(date) => changeDate(date, "to")} inputRef={ref} />
                )} />
              </Grid>

              <Grid item xs={12} sm={12}>
                <Controller control={control} name="workspace" defaultValue={workspace} rules={rules.workspace} as={
                  <TextField select variant="outlined" required fullWidth autoFocus id="workspace"
                    label="Workspace" name="workspace" error={Boolean(errors.workspace)} disabled={isLoading || !freeWorkspaces.length} >
                    {freeWorkspaces.length
                      ? Object.values(freeWorkspaces).map((ws) => <MenuItem key={ws.id} value={ws.id}>{getLabel(ws)}</MenuItem>)
                      : (<MenuItem key="N/A" value="">No free workspaces</MenuItem>)}
                  </TextField>
                } />
              </Grid>

              <Grid item xs={12} sm={12}>
                <Controller control={control} name="requester" defaultValue={requester} rules={rules.requester} as={
                  <TextField variant="outlined" required fullWidth id="requester" label="Request for" name="requester"
                  error={Boolean(errors.requester)} />} />
              </Grid>

              <Grid item xs={12} sm={12}>
                <FormHelperText id="error">{isLoading ? "Loading" : status}</FormHelperText>
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

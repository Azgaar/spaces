import React, {useEffect, useState} from "react";
import useStyles from "./ReservationDialog.style";
import {Avatar, TextField, Button, Typography, Grid, Container, Dialog, MenuItem, FormControl} from "@material-ui/core";
import CollectionsBookmarkIcon from "@material-ui/icons/CollectionsBookmark";
import {Controller, SubmitHandler, useForm} from "react-hook-form";
import {rules} from "../../../../validation/reservation";
import {Reservation, Workspace} from "../../../../types";
import {useToasterCatcher} from "../../../../hooks";
import {WorkspaceService} from "../../../../services";
import {DateTimePicker} from "@material-ui/pickers";

type Props = {
  mode: "Add" | "Edit";
  reservation: Reservation;
  close: () => void;
  submit: (formData: Reservation) => void;
}

const ReservationDialog = ({mode, reservation, close, submit}: Props) => {
  const classes = useStyles();
  const {formState, errors, setError, control, handleSubmit} = useForm<Reservation>();
  const [freeWorkspaces, setFreeWorkspaces] = useState([] as Workspace[]);
  const {catchAndTossError} = useToasterCatcher();

  useEffect(() => {
    async function fetchWorkspaces() {
      const {location, from, to} = reservation;
      const freeWorkspaces: Workspace[] = await catchAndTossError(WorkspaceService.find(location, from, to));
      if (freeWorkspaces) setFreeWorkspaces(() => freeWorkspaces);
    };
    fetchWorkspaces();
  }, [reservation.from, reservation.to]);

  const getLabel = (ws: Workspace) => {
    let label = `${ws.description}: ${ws.type} [${ws.size}]`;
    if (ws.equipment.length) label += " with " + ws.equipment.join(", ");
    return label;
  }

  const onSubmit: SubmitHandler<Reservation> = async (formData: Reservation) => {
    console.log(formState.errors);
    if (formData.from >= formData.to) {
      setError("to", {type: "manual", message: "Revervation end date must be greater than start date"});
      return;
    }
    submit(formData);
  };

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
                <Controller control={control} name="from" defaultValue={reservation.from} rules={rules.from} render={({onChange, ref, value}) => (
                  <DateTimePicker required fullWidth id="from" label="From" name="from" inputVariant="outlined"
                    showTodayButton minutesStep={15} disablePast={true} value={value} onChange={onChange} inputRef={ref} error={Boolean(errors.from)} />
                )} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller control={control} name="to" defaultValue={reservation.to} rules={rules.to} render={({onChange, ref, value}) => (
                  <DateTimePicker required fullWidth id="to" label="To" name="to" inputVariant="outlined"
                    showTodayButton minutesStep={15} disablePast={true} value={value} onChange={onChange} inputRef={ref} error={Boolean(errors.to)} />
                )} />
              </Grid>

              <Grid item xs={12} sm={12}>
                <Controller control={control} name="workspace" defaultValue={reservation.workspace} rules={rules.workspace} as={
                  <TextField select variant="outlined" required fullWidth autoFocus id="workspace"
                    label="Workspace" name="workspace" error={Boolean(errors.workspace)}>
                    {freeWorkspaces.length
                      ? Object.values(freeWorkspaces).map((option) => <MenuItem key={option.id} value={option.id}>{getLabel(option)}</MenuItem>)
                      : (<MenuItem key="N/A" value="">No free workspaces</MenuItem>)}
                  </TextField>
                } />
              </Grid>

              <Grid item xs={12} sm={12}>
                <Controller control={control} name="requester" defaultValue={reservation.requester} rules={rules.requester} as={
                  <TextField variant="outlined" required fullWidth id="requester" label="Request for" name="requester"
                  error={Boolean(errors.requester)} />} />
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

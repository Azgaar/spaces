import React, {useEffect, useState} from "react";
import useStyles from "./ReservationDialog.style";
import {Avatar, TextField, Button, Typography, Grid, Container, Dialog, MenuItem} from "@material-ui/core";
import AirplayIcon from "@material-ui/icons/Airplay";
import {useForm} from "react-hook-form";
import {rules} from "../../../../validation/reservation";
import {Reservation, Workspace} from "../../../../types";
import {useToasterCatcher} from "../../../../hooks";
import {WorkspaceService} from "../../../../services";

type Props = {
  mode: "Add" | "Edit";
  reservation: Reservation;
  close: () => void;
  submit: (formData: Reservation) => void;
}

const ReservationDialog = ({mode, reservation, close, submit}: Props) => {
  const classes = useStyles();
  const {register, errors, setValue, reset, handleSubmit} = useForm<Reservation>();
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

  useEffect(() => {
    reset({workspace: reservation.workspace, requester: reservation.requester});
  }, []);

  return (
    <Dialog open onClose={close} aria-labelledby="form-dialog-title">
      <Container maxWidth="xs" className={classes.paper}>
        <Avatar className={classes.avatar}>
          <AirplayIcon />
        </Avatar>
        <Typography component="h1" variant="h5">{mode} Reservation</Typography>

        <form className={classes.form} noValidate autoComplete="off" onSubmit={handleSubmit(submit)}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField variant="outlined" required fullWidth id="from" label="From" name="from"
                defaultValue={reservation.from} inputRef={register(rules.from)} error={Boolean(errors.from)} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField variant="outlined" required fullWidth id="to" label="To" name="to"
                defaultValue={reservation.to} inputRef={register(rules.to)} error={Boolean(errors.to)} />
            </Grid>

            <Grid item xs={12} sm={12}>
              <TextField select variant="outlined" required fullWidth id="workspace" label="Workspace" name="workspace" autoFocus
                 defaultValue={reservation.workspace} inputRef={register(rules.workspace)} error={Boolean(errors.workspace)} 
                 onChange={e => setValue("workspace", e.target.value)} disabled={freeWorkspaces.length === 0} >
                {Object.values(freeWorkspaces).map((option) => <MenuItem key={option.id} value={option.id}>{option.description}</MenuItem>)}
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <TextField variant="outlined" required fullWidth id="requester" label="Requester" name="requester"
                defaultValue={reservation.requester} inputRef={register(rules.requester)} error={Boolean(errors.requester)} />
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
        </form>
      </Container>
    </Dialog>
  );
}

export default ReservationDialog;

import React, {useEffect} from "react";
import useStyles from "./ReservationDialog.style";
import {Avatar, TextField, Button, Typography, Grid, Container, Dialog} from "@material-ui/core";
import AirplayIcon from "@material-ui/icons/Airplay";
import {useForm} from "react-hook-form";
import {rules} from "../../../../validation/reservation";
import {Reservation} from "../../../../types";

type Props = {
  mode: "Add" | "Edit";
  reservation: Reservation;
  close: () => void;
  submit: (formData: Reservation) => void;
}

const ReservationDialog = ({mode, reservation, close, submit}: Props) => {
  const classes = useStyles();
  const {register, errors, handleSubmit} = useForm<Reservation>();

  useEffect(() => {
    //reset({status: workspace.status, type: workspace.type, equipment: workspace.equipment});
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
            <Grid item xs={12}>
              <TextField variant="outlined" required fullWidth id="requester" label="Requester" name="description" autoFocus
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

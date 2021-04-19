import React from "react";
import {Avatar, Container, Typography} from "@material-ui/core";
import useStyles from "./Reservations.style";
import ReservationsList from "./ReservationsList/ReservationsList";
import TodayIcon from "@material-ui/icons/Today";

function ActiveReservations() {
  const classes = useStyles();

  return (
    <Container maxWidth="lg" className={classes.container}>
      <Avatar className={classes.avatar}>
        <TodayIcon />
      </Avatar>
      <Typography component="h1" variant="h5" className={classes.header}>Active Reservations</Typography>
      <ReservationsList active={true} />
    </Container>
  );
}

export default ActiveReservations;

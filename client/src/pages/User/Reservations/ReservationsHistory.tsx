import React from "react";
import {Avatar, Container, Typography} from "@material-ui/core";
import useStyles from "./Reservations.style";
import ReservationsList from "./ReservationsList/ReservationsList";
import DateRangeIcon from "@material-ui/icons/DateRange";

function ReservationsHistory() {
  const classes = useStyles();

  return (
    <Container maxWidth="lg" className={classes.container}>
      <Avatar className={classes.avatar}>
        <DateRangeIcon />
      </Avatar>
      <Typography component="h1" variant="h5" className={classes.header}>Reservations History</Typography>
      <ReservationsList active={false} />
    </Container>
  );
}

export default ReservationsHistory;

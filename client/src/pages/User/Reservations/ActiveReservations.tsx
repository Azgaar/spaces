import React from "react";
import {Container} from "@material-ui/core";
import useStyles from "./Reservations.style";
import Headline from "../../../components/Layout/components/Main/Headline/Headline";
import ReservationsList from "./ReservationsList/ReservationsList";

function ActiveReservations() {
  const classes = useStyles();

  return (
    <Container maxWidth="lg" className={classes.container}>
      <Headline pagename="Active Reservations" />
      <ReservationsList active={true} />
    </Container>
  );
}

export default ActiveReservations;

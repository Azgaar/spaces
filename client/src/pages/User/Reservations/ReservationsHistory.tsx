import React from "react";
import {Container} from "@material-ui/core";
import useStyles from "./Reservations.style";
import ReservationsList from "./ReservationsList/ReservationsList";
import Headline from "../../../components/Layout/components/Main/Headline/Headline";

function ReservationsHistory() {
  const classes = useStyles();

  return (
    <Container maxWidth="lg" className={classes.container}>
      <Headline pagename="Reservations History" />
      <ReservationsList active={false} />
    </Container>
  );
}

export default ReservationsHistory;

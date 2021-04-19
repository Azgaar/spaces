import React from "react";
import {Avatar, Container, Typography} from "@material-ui/core";
import BookmarksIcon from "@material-ui/icons/Bookmarks";
import useStyles from "./Reservations.style";
import ReservationsList from "./ReservationsList/ReservationsList";

function Reservations() {
  const classes = useStyles();

  return (
    <Container maxWidth="lg" className={classes.container}>
      <Avatar className={classes.avatar}>
        <BookmarksIcon />
      </Avatar>
      <Typography component="h1" variant="h5" className={classes.header}>Active Reservations</Typography>
      <ReservationsList />
    </Container>
  );
}

export default Reservations;

import React from "react";
import {Avatar, Container, Typography} from "@material-ui/core";
import BookmarksIcon from "@material-ui/icons/Bookmarks";
import useStyles from "./Dashboard.style";
import MyReservations from "./MyReservations/MyReservations";

function Dashboard() {
  const classes = useStyles();

  return (
    <Container maxWidth="lg" className={classes.container}>
      <Avatar className={classes.avatar}>
        <BookmarksIcon />
      </Avatar>
      <Typography component="h1" variant="h5" className={classes.header}>My Reservations</Typography>
      <MyReservations />
    </Container>
  );
}

export default Dashboard;

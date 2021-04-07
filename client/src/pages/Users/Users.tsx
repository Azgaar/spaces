import React from "react";
import useStyles from "./Users.style";
import {Avatar, Container, Typography} from "@material-ui/core";
import PeopleAltOutlinedIcon from "@material-ui/icons/PeopleAltOutlined";
import UsersList from "./UsersList/UsersList";

function User() {
  const classes = useStyles();

  return (
    <Container maxWidth="lg" className={classes.container}>
      <Avatar className={classes.avatar}>
        <PeopleAltOutlinedIcon />
      </Avatar>
      <Typography component="h1" variant="h5" className={classes.header}>Manage Users</Typography>
      <UsersList />
    </Container>
  );
}

export default User;

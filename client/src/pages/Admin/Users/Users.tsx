import React from "react";
import useStyles from "./Users.style";
import {Container} from "@material-ui/core";
import Headline from "../../../components/Layout/components/Main/Headline/Headline";
import UsersList from "./UsersList/UsersList";

function User() {
  const classes = useStyles();

  return (
    <Container maxWidth="lg" className={classes.container}>
      <Headline pagename="Manage Users" />
      <UsersList />
    </Container>
  );
}

export default User;

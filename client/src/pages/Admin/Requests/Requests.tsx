import React from "react";
import useStyles from "./Requests.style";
import {Container} from "@material-ui/core";
import Headline from "../../../components/Layout/components/Main/Headline/Headline";
import RequestList from "./RequestList/RequestList";

function Requests() {
  const classes = useStyles();

  return (
    <Container maxWidth="lg" className={classes.container}>
      <Headline pagename="Manage Service Requests" />
      <RequestList />
    </Container>
  );
}

export default Requests;

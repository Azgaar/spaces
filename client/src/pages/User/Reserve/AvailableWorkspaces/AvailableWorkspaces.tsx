import React from "react";
import useStyles from "./AvailableWorkspaces.style";
import {Container, Grid} from "@material-ui/core";
// import Spinner from "../../../../components/Spinner/Spinner";
// import {useToasterCatcher} from "../../../../hooks";

const ReservationsList = () => {
  const classes = useStyles();
  //const {isLoading} = useToasterCatcher();

  //if (isLoading) return <Spinner />
  return (
    <Container className={classes.container}>
      <Grid container spacing={2} alignItems="center">
        <div>WS1</div>
        <div>WS2</div>
        <div>WS3</div>
        <div>WS4</div>
      </Grid>
    </Container>
  );
};

export default ReservationsList;

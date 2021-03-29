import React from "react";
import useStyles from "./Profile.style";
import {Typography} from "@material-ui/core";

function Profile() {
  const classes = useStyles();

  return (
    <>
      <Typography variant="h1" component="h1">SPɅCES</Typography>
      <Typography variant="h3" component="h3" className={classes.header}>Profile</Typography>
    </>
  );
}

export default Profile;

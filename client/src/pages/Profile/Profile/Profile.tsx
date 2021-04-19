import React from "react";
import useFormStyles from "../../../styles/form";
import {Avatar, TextField, Button, Typography, Grid, Container} from "@material-ui/core";
import AccountCircleOutlinedIcon from "@material-ui/icons/AccountCircleOutlined";
import {Link as RouterLink} from "react-router-dom";
import {useUser} from "../../../hooks";

function Profile() {
  const formStyles = useFormStyles();
  const {user} = useUser();
  const readOnly = {readOnly: true};

  return (
    <Container maxWidth="xs" className={formStyles.paper}>
      <Avatar className={formStyles.avatar}>
        <AccountCircleOutlinedIcon />
      </Avatar>
      <Typography component="h1" variant="h5" className={formStyles.header}>Profile</Typography>
      <form className={formStyles.form}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField variant="outlined" fullWidth label="First Name" defaultValue={user.firstName} InputProps={readOnly} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField variant="outlined" fullWidth label="Last Name" defaultValue={user.lastName} InputProps={readOnly} />
          </Grid>
          <Grid item xs={12}>
            <TextField variant="outlined" fullWidth label="Email Address" defaultValue={user.email} InputProps={readOnly} />
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} className={formStyles.buttons}>
            <Button fullWidth variant="contained" color="primary" component={RouterLink} to="/editProfile">Edit Profile</Button>
          </Grid>
          <Grid item xs={12} sm={6} className={formStyles.buttons}>
            <Button fullWidth variant="contained" color="primary" component={RouterLink} to="/changePassword">Change Password</Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
}

export default Profile;

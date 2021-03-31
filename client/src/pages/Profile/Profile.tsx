import React from "react";
import useFormStyles from "../../styles/form";
import {Avatar, TextField, Button, Typography, Grid} from "@material-ui/core";
import AccountCircleOutlinedIcon from "@material-ui/icons/AccountCircleOutlined";
import {Link as RouterLink, Redirect} from "react-router-dom";
import {useUserData} from "../../hooks";

function Profile() {
  const formStyles = useFormStyles();
  const user = useUserData();
  const readOnly = {readOnly: true};

  if (!user.isAuthenticated) return <Redirect to="/signin" />;
  return (
    <div className={formStyles.paper}>
      <Avatar className={formStyles.avatar}>
        <AccountCircleOutlinedIcon />
      </Avatar>
      <Typography component="h1" variant="h5">Profile</Typography>
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
    </div>
  );
}

export default Profile;

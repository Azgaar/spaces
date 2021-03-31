import React from "react";
import useStyles from "./Profile.style";
import useFormStyles from "../../styles/form";
import {Avatar, TextField, Button, Typography, Grid, FormHelperText} from "@material-ui/core";
import AccountCircleOutlinedIcon from "@material-ui/icons/AccountCircleOutlined";
import {Redirect} from "react-router-dom";
import {useDispatch} from "react-redux";
import {useForm, SubmitHandler} from "react-hook-form";
import {ProfileForm} from "../../types";
import {updateUserData} from "../../services";
import {actions} from "../../store/actions";
import {useAuth} from "../../hooks";

function Profile() {
  const classes = useStyles();
  const formClasses = useFormStyles();
  const dispatch = useDispatch();

  const {register, errors, setError, handleSubmit, watch} = useForm<ProfileForm>();
  const passwordNew = watch("passwordNew", "");

  const onSubmit: SubmitHandler<ProfileForm> = async (formData: ProfileForm) => {
    const res = await updateUserData(formData);

    if (!res.ok) {
      setError("password", {type: "server", message: res.message});
      return;
    }

    const {email, firstName, lastName} = res;
    dispatch(actions.updateUserData({email, firstName, lastName}));
  };

  const {isAuthenticated} = useAuth();
  if (!isAuthenticated) return <Redirect to="/signin" />;
  return (
    <div className={formClasses.paper}>
      <Avatar className={formClasses.avatar}>
        <AccountCircleOutlinedIcon />
      </Avatar>
      <Typography component="h1" variant="h5">
        Edit Profile
      </Typography>
      <form className={formClasses.form} noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField name="firstName" variant="outlined" required fullWidth id="firstName" label="First Name" autoFocus
              defaultValue="test" inputRef={register({required: true, maxLength: 80})} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField variant="outlined" required fullWidth id="lastName" label="Last Name" name="lastName"
              defaultValue="test2" inputRef={register({required: true, maxLength: 100})} />
          </Grid>
          <Grid item xs={12}>
            <TextField variant="outlined" required fullWidth id="email" label="Email Address" name="email"
              defaultValue="test@email.com" inputRef={register({required: true, pattern: /^\S+@\S+$/i})} />
          </Grid>
          <Grid item xs={12}>
            <TextField variant="outlined" required fullWidth name="password" label="Current Password" type="password" id="password"
              inputRef={register({required: true, minLength: {value: 8, message: "Password must have at least 8 characters"}})}/>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField variant="outlined" required fullWidth name="passwordNew" label="New Password" type="password" id="passwordNew"
              inputRef={register({required: true, minLength: {value: 8, message: "Password must have at least 8 characters"}})}/>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField variant="outlined" required fullWidth name="passwordRepeat" label="Repeat Password" type="password" id="passwordRepeat"
              inputRef={register({validate: (value: string) => value === passwordNew || "The passwords do not match"})}/>
          </Grid>
          {(errors.password || errors.passwordRepeat) && <FormHelperText error>{errors.password?.message || errors.passwordRepeat?.message}</FormHelperText>}
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Button type="submit" fullWidth variant="contained" color="primary" className={classes.button}>Save</Button>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Button fullWidth variant="contained" color="primary" className={classes.button}>Cancel</Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
}

export default Profile;

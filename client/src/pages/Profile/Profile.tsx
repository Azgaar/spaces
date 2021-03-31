import React from "react";
import useFormStyles from "../../styles/form";
import {Avatar, TextField, Button, Typography, Grid, FormHelperText} from "@material-ui/core";
import AccountCircleOutlinedIcon from "@material-ui/icons/AccountCircleOutlined";
import {Link as RouterLink, Redirect} from "react-router-dom";
import {useDispatch} from "react-redux";
import {useForm, SubmitHandler} from "react-hook-form";
import {ProfileForm} from "../../types";
import {updateUserData} from "../../services";
import {actions} from "../../store/actions";
import {useUserData} from "../../hooks";

function Profile() {
  const formStyles = useFormStyles();
  const dispatch = useDispatch();

  const {register, errors, setError, handleSubmit, watch} = useForm<ProfileForm>();
  const passwordNew = watch("passwordNew", "");

  const {email, firstName, lastName, isAuthenticated} = useUserData();

  const onSubmit: SubmitHandler<ProfileForm> = async (formData: ProfileForm) => {
    const res = await updateUserData(formData);

    if (!res.ok) {
      setError("password", {type: "server", message: res.message});
      return;
    }

    const {email, firstName, lastName} = res;
    dispatch(actions.updateUserData({email, firstName, lastName}));
  };

  if (!isAuthenticated) return <Redirect to="/signin" />;
  return (
    <div className={formStyles.paper}>
      <Avatar className={formStyles.avatar}>
        <AccountCircleOutlinedIcon />
      </Avatar>
      <Typography component="h1" variant="h5">
        Edit Profile
      </Typography>
      <form className={formStyles.form} noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField name="firstName" variant="outlined" required fullWidth id="firstName" label="First Name" autoFocus
              defaultValue={firstName} inputRef={register({required: true, maxLength: 80})} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField variant="outlined" required fullWidth id="lastName" label="Last Name" name="lastName"
              defaultValue={lastName} inputRef={register({required: true, maxLength: 100})} />
          </Grid>
          <Grid item xs={12}>
            <TextField variant="outlined" required fullWidth id="email" label="Email Address" name="email"
              defaultValue={email} inputRef={register({required: true, pattern: /^\S+@\S+$/i})} />
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
          <Grid item xs={12} sm={6} className={formStyles.buttons}>
            <Button type="submit" fullWidth variant="contained" color="primary">Save</Button>
          </Grid>
          <Grid item xs={12} sm={6} className={formStyles.buttons}>
            <Button fullWidth variant="contained" color="primary" component={RouterLink} to="/dashboard">Cancel</Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
}

export default Profile;

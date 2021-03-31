import React from "react";
import useFormStyles from "../../../styles/form";
import {Avatar, TextField, Button, Typography, Grid} from "@material-ui/core";
import AccountCircleOutlinedIcon from "@material-ui/icons/AccountCircleOutlined";
import {Link as RouterLink, Redirect, useHistory} from "react-router-dom";
import {useDispatch} from "react-redux";
import {useForm, SubmitHandler} from "react-hook-form";
import {ProfileEditForm} from "../../../types";
import {updateUserData} from "../../../services";
import {actions} from "../../../store/actions";
import {useUserData} from "../../../hooks";

function ProfileEdit() {
  const formStyles = useFormStyles();
  const dispatch = useDispatch();
  const user = useUserData();
  const history = useHistory();

  const {register, errors, setError, handleSubmit} = useForm<ProfileEditForm>();

  const onSubmit: SubmitHandler<ProfileEditForm> = async (formData: ProfileEditForm) => {
    const res = await updateUserData(formData);

    if (!res.ok) {
      setError("password", {type: "server", message: res.message});
      return;
    }

    const {email, firstName, lastName} = res;
    dispatch(actions.updateUserData({email, firstName, lastName}));
    history.push("/profile");
    // TODO: tost to show success
  };

  if (!user.isAuthenticated) return <Redirect to="/signin" />;
  return (
    <div className={formStyles.paper}>
      <Avatar className={formStyles.avatar}>
        <AccountCircleOutlinedIcon />
      </Avatar>
      <Typography component="h1" variant="h5">Edit Profile</Typography>

      <form className={formStyles.form} noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField name="firstName" variant="outlined" required fullWidth id="firstName" label="First Name" autoFocus
              defaultValue={user.firstName} inputRef={register({required: true, maxLength: 80})}
              error={Boolean(errors.firstName)} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField variant="outlined" required fullWidth id="lastName" label="Last Name" name="lastName"
              defaultValue={user.lastName} inputRef={register({required: true, maxLength: 100})}
              error={Boolean(errors.lastName)} />
          </Grid>
          <Grid item xs={12}>
            <TextField variant="outlined" required fullWidth id="email" label="Email Address" name="email"
              defaultValue={user.email} inputRef={register({required: true, pattern: /^\S+@\S+$/i})}
              error={Boolean(errors.email)} />
          </Grid>

          <Grid item xs={12}>
            <TextField variant="outlined" required fullWidth name="password" label="Password" type="password" id="password"
              inputRef={register({required: true, minLength: {value: 8, message: "Password must have at least 8 characters"}})}
              error={Boolean(errors.password)} helperText={errors.password?.message} />
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} className={formStyles.buttons}>
            <Button type="submit" fullWidth variant="contained" color="primary">Save</Button>
          </Grid>
          <Grid item xs={12} sm={6} className={formStyles.buttons}>
            <Button fullWidth variant="contained" color="primary" component={RouterLink} to="/profile">Cancel</Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
}

export default ProfileEdit;

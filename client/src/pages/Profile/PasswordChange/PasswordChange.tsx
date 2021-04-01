import React from "react";
import useFormStyles from "../../../styles/form";
import {Avatar, TextField, Button, Typography, Grid} from "@material-ui/core";
import AccountCircleOutlinedIcon from "@material-ui/icons/AccountCircleOutlined";
import {Link as RouterLink, Redirect, useHistory} from "react-router-dom";
import {useForm, SubmitHandler} from "react-hook-form";
import {PassportChangeForm} from "../../../types";
import {changePassword} from "../../../services";
import {useUserData} from "../../../hooks";
import {rules} from "../../../validation";

function PasswordChange() {
  const formStyles = useFormStyles();
  const user = useUserData();
  const history = useHistory();

  const {register, errors, setError, handleSubmit, watch} = useForm<PassportChangeForm>();
  const passwordNew = watch("passwordNew", "");

  const onSubmit: SubmitHandler<PassportChangeForm> = async (formData: PassportChangeForm) => {
    const res = await changePassword(formData);

    if (!res.ok) {
      setError("password", {type: "server", message: res.message});
      return;
    }

    history.push("/profile");
    // TODO: tost to show success
  };

  if (!user.isAuthenticated) return <Redirect to="/signin" />;
  return (
    <div className={formStyles.paper}>
      <Avatar className={formStyles.avatar}>
        <AccountCircleOutlinedIcon />
      </Avatar>
      <Typography component="h1" variant="h5">Change Password</Typography>

      <form className={formStyles.form} noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12}>
            <TextField variant="outlined" required fullWidth name="password" label="Current Password" type="password" id="password"
              inputRef={register(rules.password)} error={Boolean(errors.password)} helperText={errors.password?.message} />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField variant="outlined" required fullWidth name="passwordNew" label="Password" type="password" id="passwordNew"
              inputRef={register(rules.password)} error={Boolean(errors.passwordNew)} helperText={errors.passwordNew?.message} />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField variant="outlined" required fullWidth name="passwordNewRepeat" label="Repeat Password" type="password" id="passwordNewRepeat"
              inputRef={register({validate: (value: string) => value === passwordNew || rules.repeat})}
              error={Boolean(errors.passwordNewRepeat)} helperText={errors.passwordNewRepeat?.message} />
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

export default PasswordChange;

import React from "react";
import useFormStyles from "../../../styles/form";
import {Avatar, TextField, Button, Typography, Grid, Container} from "@material-ui/core";
import AccountCircleOutlinedIcon from "@material-ui/icons/AccountCircleOutlined";
import {Link as RouterLink, useHistory} from "react-router-dom";
import {useDispatch} from "react-redux";
import {useForm, SubmitHandler} from "react-hook-form";
import {ProfileEditForm} from "../../../types";
import {updateUserData} from "../../../services";
import {actions} from "../../../store/actions";
import {useUser} from "../../../hooks";
import {rules} from "../../../validation";
import {MessageType, useMessage} from "../../../components/providers/MessageProvider";

function ProfileEdit() {
  const formStyles = useFormStyles();
  const dispatch = useDispatch();
  const {user} = useUser();
  const {pushMessage} = useMessage();
  const history = useHistory();

  const {register, errors, handleSubmit} = useForm<ProfileEditForm>();

  const onSubmit: SubmitHandler<ProfileEditForm> = async (formData: ProfileEditForm) => {
    const res = await updateUserData(formData);

    if (!res.ok) {
      pushMessage({title: res.message, type: MessageType.ERROR});
      return;
    }

    const {email, firstName, lastName} = res;
    dispatch(actions.updateUserData({email, firstName, lastName}));
    
    pushMessage({title: "Profile is changed", type: MessageType.SUCCESS});
    history.push("/profile");
  };

  return (
    <Container maxWidth="xs" className={formStyles.paper}>
      <Avatar className={formStyles.avatar}>
        <AccountCircleOutlinedIcon />
      </Avatar>
      <Typography component="h1" variant="h5" className={formStyles.header}>Edit Profile</Typography>

      <form className={formStyles.form} noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField name="firstName" variant="outlined" required fullWidth id="firstName" label="First Name" autoFocus
              defaultValue={user.firstName} inputRef={register(rules.firstName)}
              error={Boolean(errors.firstName)} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField variant="outlined" required fullWidth id="lastName" label="Last Name" name="lastName"
              defaultValue={user.lastName} inputRef={register(rules.lastName)}
              error={Boolean(errors.lastName)} />
          </Grid>
          <Grid item xs={12}>
            <TextField variant="outlined" required fullWidth id="email" label="Email Address" name="email"
              defaultValue={user.email} inputRef={register(rules.email)} error={Boolean(errors.email)} />
          </Grid>

          <Grid item xs={12}>
            <TextField variant="outlined" required fullWidth name="password" label="Password" type="password" id="password"
              inputRef={register(rules.password)} error={Boolean(errors.password)} helperText={errors.password?.message} />
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
    </Container>
  );
}

export default ProfileEdit;

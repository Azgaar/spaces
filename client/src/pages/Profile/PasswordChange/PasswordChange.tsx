import React from "react";
import useFormStyles from "../../../styles/form";
import {Avatar, TextField, Button, Typography, Grid, Container} from "@material-ui/core";
import AccountCircleOutlinedIcon from "@material-ui/icons/AccountCircleOutlined";
import {Link as RouterLink, useHistory} from "react-router-dom";
import {useForm, SubmitHandler} from "react-hook-form";
import {PassportChangeForm} from "../../../types";
import {UserService} from "../../../services";
import {rules} from "../../../validation";
import {MessageType, useMessage} from "../../../components/providers/MessageProvider";
import {useRequest} from "../../../hooks";

function PasswordChange() {
  const formStyles = useFormStyles();
  const {pushMessage} = useMessage();
  const history = useHistory();
  const {handleRequest} = useRequest();

  const {register, errors, handleSubmit, watch} = useForm<PassportChangeForm>();
  const passwordNew = watch("passwordNew", "");

  const onSubmit: SubmitHandler<PassportChangeForm> = async (formData: PassportChangeForm) => {
    const res = await handleRequest(UserService.changePassword(formData));
    if (!res) return;
    pushMessage({title: "Password is changed", type: MessageType.SUCCESS});
    history.push("/profile");
  };

  return (
    <Container maxWidth="xs" className={formStyles.paper}>
      <Avatar className={formStyles.avatar}>
        <AccountCircleOutlinedIcon />
      </Avatar>
      <Typography component="h1" variant="h5" className={formStyles.header}>Change Password</Typography>

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
    </Container>
  );
}

export default PasswordChange;

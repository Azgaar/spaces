import React from "react";
import useFormStyles from "../../styles/form";
import {Avatar, TextField, Button, Typography, Grid} from "@material-ui/core";
import MailOutlineOutlinedIcon from "@material-ui/icons/MailOutlineOutlined";
import {Link as RouterLink, useHistory} from "react-router-dom";
import {useForm, SubmitHandler} from "react-hook-form";
import {ForgotPasswordForm} from "../../types";
import {forgotPassword} from "../../services";
import {rules} from "../../validation";
import {MessageType, useMessage} from "../../components/providers/MessageProvider";

function ForgotPassword() {
  const formStyles = useFormStyles();
  const {pushMessage} = useMessage();
  const history = useHistory();
  const {register, errors, handleSubmit} = useForm<ForgotPasswordForm>();

  const onSubmit: SubmitHandler<ForgotPasswordForm> = async (formData: ForgotPasswordForm) => {
    const res = await forgotPassword(formData);

    if (!res.ok) {
      pushMessage({title: res.message, type: MessageType.ERROR});
      return;
    }

    pushMessage({title: `Email is send to ${formData.email}`, type: MessageType.SUCCESS});
    history.push("/signin");
  };

  return (
    <div className={formStyles.paper}>
      <Avatar className={formStyles.avatar}>
        <MailOutlineOutlinedIcon />
      </Avatar>
      <Typography component="h1" variant="h5">Forgot Password</Typography>
      <form className={formStyles.form} noValidate onSubmit={handleSubmit(onSubmit)}>
        <Typography component="h2" variant="subtitle2" align="justify">
          {"Lost your password? Please enter your email address. A temporary password will be sent to your mailbox."}
        </Typography>

        <TextField variant="outlined" margin="normal" required fullWidth id="email" label="Email Address" name="email"
          autoComplete="email" autoFocus error={Boolean(errors.email)} inputRef={register(rules.email)} />

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} className={formStyles.buttons}>
            <Button type="submit" fullWidth variant="contained" color="primary">Send Email</Button>
          </Grid>
          <Grid item xs={12} sm={6} className={formStyles.buttons}>
            <Button fullWidth variant="contained" color="primary" component={RouterLink} to="/profile">Cancel</Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
}

export default ForgotPassword;

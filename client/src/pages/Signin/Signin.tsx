import React from "react";
import useStyles from "./Signin.style";
import {Avatar, TextField, Button, Typography, Grid, Link} from "@material-ui/core";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import {Link as RouterLink} from "react-router-dom";
import {useForm, SubmitHandler} from "react-hook-form";
import {SigninForm} from "../../types";
import {login} from "../../services";

function Signin() {
  const classes = useStyles();

  const {register, handleSubmit} = useForm<SigninForm>();

  const onSubmit: SubmitHandler<SigninForm> = async (formData: SigninForm) => {
    console.log(formData);
    login(formData);
  };

  return (
    <div className={classes.paper}>
      <Avatar className={classes.avatar}>
        <LockOutlinedIcon />
      </Avatar>
      <Typography component="h1" variant="h5">
        Sign in
      </Typography>
      <form className={classes.form} noValidate onSubmit={handleSubmit(onSubmit)}>
        <TextField variant="outlined" margin="normal" required fullWidth id="email" label="Email Address" name="email" autoComplete="email" autoFocus inputRef={register({required: true, pattern: /^\S+@\S+$/i})} />
        <TextField variant="outlined" margin="normal" required fullWidth name="password" label="Password" type="password" id="password" autoComplete="current-password" inputRef={register({required: true, minLength: 8})} />
        <Grid container>
          <Grid item xs>
            <Link href="#" variant="body2" component={RouterLink} to="/forgotPassword">
              Forgot password?
            </Link>
          </Grid>
          <Grid item>
            <Link href="#" variant="body2" component={RouterLink} to="/signup">
              {"Don't have an account? Sign Up"}
            </Link>
          </Grid>
        </Grid>
        <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
          Sign In
        </Button>
      </form>
    </div>
  );
}

export default Signin;

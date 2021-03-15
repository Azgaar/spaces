import React, {useRef} from "react";
import useStyles from "./Signup.style";
import {Avatar, TextField, Button, Checkbox, Typography, Grid, Link} from "@material-ui/core";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import {Link as RouterLink} from "react-router-dom";
import {useForm, SubmitHandler} from "react-hook-form";

type FormValues = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  passwordRepeat: string;
  acceptTerms: boolean;
};

function Signup() {
  const classes = useStyles();

  const {register, errors, handleSubmit, watch} = useForm<FormValues>();
  const password = useRef({});
  password.current = watch("password", "");

  const onSubmit: SubmitHandler<FormValues> = async (data: FormValues) => {
    alert(JSON.stringify(data));
  };

  return (
    <div className={classes.paper}>
      <Avatar className={classes.avatar}>
        <LockOutlinedIcon />
      </Avatar>
      <Typography component="h1" variant="h5">
        Sign up
      </Typography>
      <form className={classes.form} noValidate onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField autoComplete="fname" name="firstName" variant="outlined" required fullWidth id="firstName" label="First Name" autoFocus inputRef={register({required: true, maxLength: 80})} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField variant="outlined" required fullWidth id="lastName" label="Last Name" name="lastName" autoComplete="lname" inputRef={register({required: true, maxLength: 100})} />
          </Grid>
          <Grid item xs={12}>
            <TextField variant="outlined" required fullWidth id="email" label="Email Address" name="email" autoComplete="email" inputRef={register({required: true, pattern: /^\S+@\S+$/i})} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              variant="outlined"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              inputRef={register({
                required: true,
                minLength: {
                  value: 8,
                  message: "Password must have at least 8 characters"
                }
              })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              variant="outlined"
              required
              fullWidth
              name="passwordRepeat"
              label="Repeat Password"
              type="password"
              id="passwordRepeat"
              inputRef={register({
                validate: value => value === password.current || "The passwords do not match"
              })}
            />
          </Grid>
          {(errors.password || errors.passwordRepeat) && <Typography color="error">{errors.password?.message || errors.passwordRepeat?.message}</Typography>}

          <Grid item xs={12} className={classes.terms}>
            <Checkbox required name="acceptTerms" color="primary" inputRef={register({required: "Please read and accept terms"})} />
            {"I accept the "}
            <Link component={RouterLink} to={"/terms"}>
              terms of use
            </Link>
            {" and "}
            <Link component={RouterLink} to={"/privacy"}>
              privacy policy
            </Link>
            {errors.acceptTerms && <Typography color="error">{errors.acceptTerms.message}</Typography>}
          </Grid>
        </Grid>
        <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
          Sign Up
        </Button>
      </form>
    </div>
  );
}

export default Signup;

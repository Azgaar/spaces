import React from "react";
import useStyles from "./Signup.style";
import {Avatar, TextField, Button, Checkbox, Typography, Grid, Link, FormHelperText} from "@material-ui/core";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import {Link as RouterLink, Redirect} from "react-router-dom";
import {useDispatch} from "react-redux";
import {useForm, SubmitHandler} from "react-hook-form";
import {SignUpForm} from "../../types";
import {signup} from "../../services";
import {actions} from "../../store/actions";
import {useAuth} from "../../hooks";

function Signup() {
  const classes = useStyles();
  const dispatch = useDispatch();

  const {register, errors, setError, handleSubmit, watch} = useForm<SignUpForm>();
  const password = watch("password", "");

  const onSubmit: SubmitHandler<SignUpForm> = async (formData: SignUpForm) => {
    const res = await signup(formData);

    if (!res.ok) {
      setError("password", {type: "server", message: res.message});
      return;
    }

    const {email, firstName, lastName, role} = res;
    dispatch(actions.login({email, firstName, lastName, role}));
  };

  const {isAuthenticated} = useAuth();
  if (isAuthenticated) return <Redirect to="/dashboard" />;
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
                validate: (value: string) => value === password || "The passwords do not match"
              })}
            />
          </Grid>
          {(errors.password || errors.passwordRepeat) && <FormHelperText error>{errors.password?.message || errors.passwordRepeat?.message}</FormHelperText>}

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
            {errors.acceptTerms && <FormHelperText error>{errors.acceptTerms.message}</FormHelperText>}
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

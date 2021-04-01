import React from "react";
import useStyles from "./Signup.style";
import useFormStyles from "../../styles/form";
import {Avatar, TextField, Button, Checkbox, Typography, Grid, Link, FormHelperText} from "@material-ui/core";
import ListAltOutlinedIcon from "@material-ui/icons/ListAltOutlined";
import {Link as RouterLink, Redirect} from "react-router-dom";
import {useDispatch} from "react-redux";
import {useForm, SubmitHandler} from "react-hook-form";
import {SignUpForm} from "../../types";
import {signup} from "../../services";
import {actions} from "../../store/actions";
import {useAuth} from "../../hooks";
import {rules} from "../../validation";

function Signup() {
  const styles = useStyles();
  const formStyles = useFormStyles();
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
    <div className={formStyles.paper}>
      <Avatar className={formStyles.avatar}>
        <ListAltOutlinedIcon />
      </Avatar>
      <Typography component="h1" variant="h5">Sign up</Typography>
      <form className={formStyles.form} noValidate onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField autoComplete="fname" name="firstName" variant="outlined" required fullWidth id="firstName" label="First Name" autoFocus
              inputRef={register(rules.firstName)} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField variant="outlined" required fullWidth id="lastName" label="Last Name" name="lastName" autoComplete="lname"
              inputRef={register(rules.lastName)} />
          </Grid>
          <Grid item xs={12}>
            <TextField variant="outlined" required fullWidth id="email" label="Email Address" name="email" autoComplete="email"
              inputRef={register(rules.email)} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField variant="outlined" required fullWidth name="password" label="Password" type="password" id="password"
              inputRef={register(rules.password)}/>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField variant="outlined" required fullWidth name="passwordRepeat" label="Repeat Password" type="password" id="passwordRepeat"
              inputRef={register({validate: (value: string) => value === password || rules.repeat})}
            />
          </Grid>
          {(errors.password || errors.passwordRepeat) && <FormHelperText error>{errors.password?.message || errors.passwordRepeat?.message}</FormHelperText>}

          <Grid item xs={12} className={styles.terms}>
            <Checkbox required name="acceptTerms" color="primary" inputRef={register(rules.terms)} />
            {"I accept the "}
            <Link component={RouterLink} to={"/terms"}>terms of use</Link>
            {" and "}
            <Link component={RouterLink} to={"/privacy"}>privacy policy</Link>
            {errors.acceptTerms && <FormHelperText error>{errors.acceptTerms.message}</FormHelperText>}
          </Grid>
        </Grid>
        <Button type="submit" fullWidth variant="contained" color="primary" className={formStyles.buttons}>Sign Up</Button>
      </form>
    </div>
  );
}

export default Signup;

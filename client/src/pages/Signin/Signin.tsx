import React from "react";
import useFormStyles from "../../styles/form";
import {Avatar, TextField, Button, Typography, Grid, Link, FormHelperText} from "@material-ui/core";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import {Link as RouterLink, Redirect} from "react-router-dom";
import {useForm, SubmitHandler} from "react-hook-form";
import {useDispatch} from "react-redux";
import {SignInForm} from "../../types";
import {signin} from "../../services";
import {actions} from "../../store/actions";
import {useAuth} from "../../hooks";

function Signin() {
  const formStyles = useFormStyles();
  const dispatch = useDispatch();

  const {register, errors, setError, handleSubmit} = useForm<SignInForm>();

  const onSubmit: SubmitHandler<SignInForm> = async (formData: SignInForm) => {
    const res = await signin(formData);

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
        <LockOutlinedIcon />
      </Avatar>
      <Typography component="h1" variant="h5">Sign in</Typography>
      <form className={formStyles.form} noValidate onSubmit={handleSubmit(onSubmit)}>
        <TextField variant="outlined" margin="normal" required fullWidth id="email" label="Email Address" name="email" autoComplete="email" autoFocus inputRef={register({required: true, pattern: {value: /^\S+@\S+$/i, message: "Enter valid email"}})} />
        <TextField variant="outlined" margin="normal" required fullWidth name="password" label="Password" type="password" id="password" autoComplete="current-password" inputRef={register({required: true, minLength: {value: 8, message: "Password must have at least 8 characters"}})} />
        <Grid container>
          <Grid item xs>
            <Link href="#" variant="body2" component={RouterLink} to="/forgotPassword">Forgot password?</Link>
          </Grid>
          <Grid item>
            <Link href="#" variant="body2" component={RouterLink} to="/signup">{"Don't have an account? Sign Up"}</Link>
          </Grid>
        </Grid>

        {errors && <FormHelperText error>{errors.email?.message || errors.password?.message}</FormHelperText>}
        <Button type="submit" fullWidth variant="contained" color="primary" className={formStyles.buttons}>Sign In</Button>
      </form>
    </div>
  );
}

export default Signin;

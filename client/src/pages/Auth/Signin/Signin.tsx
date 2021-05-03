import React, {FC} from 'react';
import useFormStyles from '../../../styles/form';
import {Avatar, TextField, Button, Typography, Grid, Link, Container} from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import {Link as RouterLink, Redirect, useHistory} from 'react-router-dom';
import {useForm, SubmitHandler} from 'react-hook-form';
import {useDispatch} from 'react-redux';
import {SignInForm, UserData} from '../../../types';
import {actions} from '../../../store/actions';
import {rules} from '../../../validation/user';
import {useToasterCatcher, useUser} from '../../../hooks';
import {AuthService} from '../../../services';

const Signin: FC = () => {
  const {isAuthenticated} = useUser();
  const formStyles = useFormStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const {catchAndTossError} = useToasterCatcher();
  const {register, errors, handleSubmit} = useForm<SignInForm>();

  const onSubmit: SubmitHandler<SignInForm> = async (formData: SignInForm) => {
    const userData = (await catchAndTossError(AuthService.signin(formData))) as UserData | undefined;
    if (!userData) {
      return;
    }
    dispatch(actions.login(userData));
    history.push('/');
  };

  if (isAuthenticated) {
    return <Redirect to="/" />;
  }
  return (
    <Container maxWidth="xs" className={formStyles.paper}>
      <Avatar className={formStyles.avatar}>
        <LockOutlinedIcon />
      </Avatar>
      <Typography component="h1" variant="h5" className={formStyles.header}>
        Sign in
      </Typography>
      <form className={formStyles.form} noValidate onSubmit={handleSubmit(onSubmit)}>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          autoFocus
          inputRef={register(rules.email)}
          error={Boolean(errors.email)}
          helperText={errors.email?.message}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="current-password"
          inputRef={register(rules.password)}
          error={Boolean(errors.password)}
          helperText={errors.password?.message}
        />

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

        <Button type="submit" fullWidth variant="contained" color="primary" className={formStyles.buttons}>
          Sign In
        </Button>
      </form>
    </Container>
  );
};

export default Signin;

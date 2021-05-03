import React from 'react';
import useFormStyles from '../../../styles/form';
import {Avatar, TextField, Button, Checkbox, Typography, Grid, FormHelperText, FormControlLabel, Container} from '@material-ui/core';
import ListAltOutlinedIcon from '@material-ui/icons/ListAltOutlined';
import {Redirect, useHistory} from 'react-router-dom';
import {useDispatch} from 'react-redux';
import {useForm, SubmitHandler} from 'react-hook-form';
import {SignUpForm} from '../../../types';
import {UserService} from '../../../services';
import {actions} from '../../../store/actions';
import {rules} from '../../../validation/user';
import {useToasterCatcher, useUser} from '../../../hooks';
import Terms from './Terms/Terms';

function Signup() {
  const {isAuthenticated} = useUser();
  const formStyles = useFormStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const {catchAndTossError} = useToasterCatcher();

  const {register, errors, handleSubmit, watch} = useForm<SignUpForm>();
  const password = watch('password', '');

  const onSubmit: SubmitHandler<SignUpForm> = async (formData: SignUpForm) => {
    const res = await catchAndTossError(UserService.signup(formData));
    if (!res) {return;}
    dispatch(actions.login(res));
    history.push('/');
  };

  if (isAuthenticated) {return <Redirect to="/" />;}
  return (
    <Container maxWidth="xs" className={formStyles.paper}>
      <Avatar className={formStyles.avatar}>
        <ListAltOutlinedIcon />
      </Avatar>
      <Typography component="h1" variant="h5" className={formStyles.header}>
        Sign up
      </Typography>
      <form className={formStyles.form} noValidate onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              autoComplete="fname"
              name="firstName"
              variant="outlined"
              required
              fullWidth
              id="firstName"
              label="First Name"
              autoFocus
              inputRef={register(rules.firstName)}
              error={Boolean(errors.firstName)}
              helperText={errors.firstName?.message}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              variant="outlined"
              required
              fullWidth
              id="lastName"
              label="Last Name"
              name="lastName"
              autoComplete="lname"
              inputRef={register(rules.lastName)}
              error={Boolean(errors.lastName)}
              helperText={errors.lastName?.message}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              inputRef={register(rules.email)}
              error={Boolean(errors.email)}
              helperText={errors.email?.message}
            />
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
              inputRef={register(rules.password)}
              error={Boolean(errors.password)}
              helperText={errors.password?.message}
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
              inputRef={register({validate: (value: string) => value === password || rules.repeat})}
              error={Boolean(errors.passwordRepeat)}
              helperText={errors.passwordRepeat?.message}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel control={<Checkbox name="acceptTerms" color="primary" inputRef={register(rules.terms)} />} label={<Terms />} />
            {errors.acceptTerms && <FormHelperText error>{errors.acceptTerms.message}</FormHelperText>}
          </Grid>
        </Grid>
        <Button type="submit" fullWidth variant="contained" color="primary" className={formStyles.buttons}>
          Sign Up
        </Button>
      </form>
    </Container>
  );
}

export default Signup;

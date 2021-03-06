import React, {FC} from 'react';
import {TextField, Button, Checkbox, Grid, FormHelperText, FormControlLabel, Box} from '@material-ui/core';
import {Redirect, useHistory} from 'react-router-dom';
import {useDispatch} from 'react-redux';
import {SignUpForm, UserData} from '../../../types';
import {UserService} from '../../../services';
import {actions} from '../../../store/actions';
import {useToasterCatcher, useUser} from '../../../hooks';
import Terms from './Terms/Terms';
import {useFormik} from 'formik';
import {signUpValidationSchema} from '../../../validation/auth';
import Content from '../../../components/Layout/components/Main/Content';

const Signup: FC = () => {
  const {isAuthenticated} = useUser();
  const dispatch = useDispatch();
  const history = useHistory();
  const {catchAndTossError} = useToasterCatcher();

  const submitForm = async (values: SignUpForm) => {
    const user = (await catchAndTossError(UserService.registerUser(values))) as UserData | undefined;
    if (user) {
      dispatch(actions.login(user));
      history.push('/');
    }
  };

  const formik = useFormik({
    initialValues: {firstName: '', lastName: '', email: '', password: '', passwordRepeat: '', acceptTerms: false},
    validationSchema: signUpValidationSchema,
    onSubmit: submitForm
  });

  if (isAuthenticated) {
    return <Redirect to="/" />;
  }
  return (
    <Content maxWidth="xs" pagename="Sign up">
      <form noValidate onSubmit={formik.handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              variant="outlined"
              required
              fullWidth
              id="firstName"
              label="First Name"
              name="firstName"
              autoComplete="fname"
              autoFocus
              value={formik.values.firstName}
              onChange={formik.handleChange}
              error={formik.touched.firstName && Boolean(formik.errors.firstName)}
              helperText={formik.touched.firstName && formik.errors.firstName}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              variant="outlined"
              required
              fullWidth
              id="lastName"
              label="Last Name"
              name="lastName"
              autoComplete="lname"
              value={formik.values.lastName}
              onChange={formik.handleChange}
              error={formik.touched.lastName && Boolean(formik.errors.lastName)}
              helperText={formik.touched.lastName && formik.errors.lastName}
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
              value={formik.values.email}
              onChange={formik.handleChange}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              variant="outlined"
              required
              fullWidth
              type="password"
              id="password"
              label="Password"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              variant="outlined"
              required
              fullWidth
              type="password"
              id="passwordRepeat"
              label="Repeat Password"
              name="passwordRepeat"
              value={formik.values.passwordRepeat}
              onChange={formik.handleChange}
              error={formik.touched.passwordRepeat && Boolean(formik.errors.passwordRepeat)}
              helperText={formik.touched.passwordRepeat && formik.errors.passwordRepeat}
            />
          </Grid>
        </Grid>

        <Box m={1}>
          <FormControlLabel label={<Terms />} control={<Checkbox name="acceptTerms" color="primary" value={formik.values.acceptTerms} onChange={formik.handleChange} />} />
          {formik.touched.acceptTerms && Boolean(formik.errors.acceptTerms) && <FormHelperText error>{formik.errors.acceptTerms}</FormHelperText>}
        </Box>

        <Box mt={1} mb={2}>
          <Button type="submit" fullWidth variant="contained" color="primary">
            Sign Up
          </Button>
        </Box>
      </form>
    </Content>
  );
};

export default Signup;

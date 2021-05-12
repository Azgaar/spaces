import React, {FC} from 'react';
import useFormStyles from '../../../styles/form';
import {TextField, Button, Typography, Grid} from '@material-ui/core';
import {Link as RouterLink, Redirect, useHistory} from 'react-router-dom';
import {useForm, SubmitHandler} from 'react-hook-form';
import {ForgotPasswordForm} from '../../../types';
import {UserService} from '../../../services';
import {rules} from '../../../validation/user';
import {MessageType, useMessage} from '../../../components/Providers/MessageProvider';
import {useToasterCatcher, useUser} from '../../../hooks';
import Content from '../../../components/Layout/components/Main/Content';

const ForgotPassword: FC = () => {
  const {isAuthenticated} = useUser();
  const formStyles = useFormStyles();
  const {pushMessage} = useMessage();
  const history = useHistory();
  const {register, errors, handleSubmit} = useForm<ForgotPasswordForm>();
  const {catchAndTossError} = useToasterCatcher();

  const onSubmit: SubmitHandler<ForgotPasswordForm> = async (formData: ForgotPasswordForm) => {
    const res = await catchAndTossError(UserService.resetPassword(formData));
    if (!res) {
      return;
    }
    pushMessage({title: `Email is send to ${formData.email}`, type: MessageType.SUCCESS});
    history.push('/signin');
  };

  if (isAuthenticated) {
    return <Redirect to="/" />;
  }
  return (
    <Content maxWidth="xs" pagename="Forgot Password">
      <form className={formStyles.form} noValidate onSubmit={handleSubmit(onSubmit)}>
        <Typography component="h2" variant="subtitle2" align="justify">
          {`Lost your password?
          Please enter your email address.
          A temporary password will be sent to your mailbox.
          Please use it to log in and then change the password to a secure one`}
        </Typography>

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
          error={Boolean(errors.email)}
          inputRef={register(rules.email)}
        />

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} className={formStyles.buttons}>
            <Button type="submit" fullWidth variant="contained" color="primary">
              Send Email
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} className={formStyles.buttons}>
            <Button fullWidth variant="contained" color="primary" component={RouterLink} to="/profile">
              Cancel
            </Button>
          </Grid>
        </Grid>
      </form>
    </Content>
  );
};

export default ForgotPassword;

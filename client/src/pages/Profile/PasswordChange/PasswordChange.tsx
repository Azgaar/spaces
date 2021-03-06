import React, {FC} from 'react';
import {TextField, Button, Grid, Box} from '@material-ui/core';
import {Link as RouterLink, useHistory} from 'react-router-dom';
import {useForm, SubmitHandler} from 'react-hook-form';
import {UserUpdateForm} from '../../../types';
import {UserService} from '../../../services';
import {rules} from '../../../validation/user';
import {MessageType, useMessage} from '../../../components/Providers/MessageProvider';
import {useToasterCatcher, useUser} from '../../../hooks';
import Content from '../../../components/Layout/components/Main/Content';

const PasswordChange: FC = () => {
  const {user} = useUser();
  const {pushMessage} = useMessage();
  const history = useHistory();
  const {catchAndTossError} = useToasterCatcher();

  const {register, errors, handleSubmit, watch} = useForm<Partial<UserUpdateForm>>();
  const passwordNew = watch('passwordNew', '');

  const onSubmit: SubmitHandler<Partial<UserUpdateForm>> = async (formData: Partial<UserUpdateForm>) => {
    const updatedUser = await catchAndTossError(UserService.updateUser(user.id, formData));
    if (updatedUser) {
      pushMessage({title: 'Password is changed', type: MessageType.SUCCESS});
      history.push('/profile');
    }
  };

  return (
    <Content maxWidth="xs" pagename="Change Password">
      <form noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12}>
            <TextField
              variant="outlined"
              required
              fullWidth
              name="password"
              label="Current Password"
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
              name="passwordNew"
              label="New Password"
              type="password"
              id="passwordNew"
              inputRef={register(rules.password)}
              error={Boolean(errors.passwordNew)}
              helperText={errors.passwordNew?.message}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              variant="outlined"
              required
              fullWidth
              name="passwordNewRepeat"
              label="Repeat Password"
              type="password"
              id="passwordNewRepeat"
              inputRef={register({validate: (value: string) => value === passwordNew || rules.repeat})}
              error={Boolean(errors.passwordNewRepeat)}
              helperText={errors.passwordNewRepeat?.message}
            />
          </Grid>
        </Grid>

        <Box mt={1} mb={2}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Button type="submit" fullWidth variant="contained" color="primary">
                Save
              </Button>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button fullWidth variant="contained" color="primary" component={RouterLink} to="/profile">
                Cancel
              </Button>
            </Grid>
          </Grid>
        </Box>
      </form>
    </Content>
  );
};

export default PasswordChange;

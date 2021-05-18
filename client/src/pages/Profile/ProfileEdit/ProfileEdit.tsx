import React, {FC} from 'react';
import {TextField, Button, Grid, Box} from '@material-ui/core';
import {Link as RouterLink, useHistory} from 'react-router-dom';
import {useDispatch} from 'react-redux';
import {useForm, SubmitHandler} from 'react-hook-form';
import {UserUpdateForm, UserData} from '../../../types';
import {UserService} from '../../../services';
import {actions} from '../../../store/actions';
import {useToasterCatcher, useUser} from '../../../hooks';
import {rules} from '../../../validation/user';
import {MessageType, useMessage} from '../../../components/Providers/MessageProvider';
import Content from '../../../components/Layout/components/Main/Content';

const ProfileEdit: FC = () => {
  const dispatch = useDispatch();
  const {user} = useUser();
  const {pushMessage} = useMessage();
  const history = useHistory();
  const {catchAndTossError} = useToasterCatcher();

  const {register, errors, handleSubmit} = useForm<Partial<UserUpdateForm>>();

  const onSubmit: SubmitHandler<Partial<UserUpdateForm>> = async (formData: Partial<UserUpdateForm>) => {
    const updatedUser = (await catchAndTossError(UserService.updateUser(user.id, formData))) as UserData | undefined;
    if (updatedUser) {
      dispatch(actions.updateUserData(updatedUser));
      pushMessage({title: 'Profile is changed', type: MessageType.SUCCESS});
      history.push('/profile');
    }
  };

  return (
    <Content maxWidth="xs" pagename="Edit Profile">
      <form noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              name="firstName"
              variant="outlined"
              required
              fullWidth
              id="firstName"
              label="First Name"
              autoFocus
              defaultValue={user.firstName}
              inputRef={register(rules.firstName)}
              error={Boolean(errors.firstName)}
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
              defaultValue={user.lastName}
              inputRef={register(rules.lastName)}
              error={Boolean(errors.lastName)}
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
              defaultValue={user.email}
              inputRef={register(rules.email)}
              error={Boolean(errors.email)}
            />
          </Grid>

          <Grid item xs={12}>
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

export default ProfileEdit;

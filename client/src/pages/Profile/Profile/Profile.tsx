import React, {FC} from 'react';
import useFormStyles from '../../../styles/form';
import {TextField, Button, Grid, Container} from '@material-ui/core';
import {Link as RouterLink} from 'react-router-dom';
import {useUser} from '../../../hooks';
import Headline from '../../../components/Layout/components/Main/Headline/Headline';

const Profile: FC = () => {
  const formStyles = useFormStyles();
  const {user} = useUser();
  const readOnly = {readOnly: true};

  return (
    <Container maxWidth="xs" className={formStyles.paper}>
      <Headline pagename="Profile" />
      <form className={formStyles.form}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField variant="outlined" fullWidth label="First Name" defaultValue={user.firstName} InputProps={readOnly} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField variant="outlined" fullWidth label="Last Name" defaultValue={user.lastName} InputProps={readOnly} />
          </Grid>
          <Grid item xs={12}>
            <TextField variant="outlined" fullWidth label="Email Address" defaultValue={user.email} InputProps={readOnly} />
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} className={formStyles.buttons}>
            <Button fullWidth variant="contained" color="primary" component={RouterLink} to="/editProfile">
              Edit Profile
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} className={formStyles.buttons}>
            <Button fullWidth variant="contained" color="primary" component={RouterLink} to="/changePassword">
              Change Password
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default Profile;

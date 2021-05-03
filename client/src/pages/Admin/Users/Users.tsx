import React, {FC} from 'react';
import useStyles from './Users.style';
import {Container} from '@material-ui/core';
import Headline from '../../../components/Layout/components/Main/Headline/Headline';
import UsersList from './UsersList/UsersList';

const User: FC = () => {
  const classes = useStyles();

  return (
    <Container maxWidth="lg" className={classes.container}>
      <Headline pagename="Manage Users" />
      <UsersList />
    </Container>
  );
};

export default User;

import React, {FC} from 'react';
import {Redirect} from 'react-router-dom';
import {useUser} from '../../hooks';

const Home: FC = () => {
  const {isAuthenticated, isAdmin} = useUser();

  if (!isAuthenticated) {
    return <Redirect to="/signin" />;
  }
  if (isAdmin) {
    return <Redirect to="/admin/reservations" />;
  }
  return <Redirect to="/reservations" />;
};

export default Home;

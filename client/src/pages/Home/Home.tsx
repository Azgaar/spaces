import React from 'react';
import {Redirect} from 'react-router-dom';
import {useUser} from '../../hooks';

function Home() {
  const {isAuthenticated, isAdmin} = useUser();

  if (!isAuthenticated) {
    return <Redirect to="/signin" />;
  }
  if (isAdmin) {
    return <Redirect to="/admin/reservations" />;
  }
  return <Redirect to="/reservations" />;
}

export default Home;

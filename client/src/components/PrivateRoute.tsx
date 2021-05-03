import React from 'react';
import {Route, Redirect} from 'react-router-dom';
import {useUser} from '../hooks';
import {UserRole} from '../types';

type RouteProps = {
  path: string;
  requiredRole?: UserRole;
  component: React.FC;
};

const PrivateRoute = ({path, requiredRole, component}: RouteProps): React.ReactElement => {
  const {isAuthenticated, user} = useUser();

  if (!isAuthenticated) {return <Redirect to="/signin" />;}
  if (requiredRole && user.role !== requiredRole) {return <Redirect to="/" />;}
  return <Route path={path} component={component} />;
};

export {PrivateRoute};

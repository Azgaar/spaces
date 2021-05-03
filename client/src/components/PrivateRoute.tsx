import React, {FC} from 'react';
import {Route, Redirect} from 'react-router-dom';
import {useUser} from '../hooks';
import {UserRole} from '../types';

type Props = {
  path: string;
  requiredRole?: UserRole;
  component: FC;
};

const PrivateRoute: FC<Props> = ({path, requiredRole, component}) => {
  const {isAuthenticated, user} = useUser();

  if (!isAuthenticated) {
    return <Redirect to="/signin" />;
  }
  if (requiredRole && user.role !== requiredRole) {
    return <Redirect to="/" />;
  }
  return <Route path={path} component={component} />;
};

export {PrivateRoute};

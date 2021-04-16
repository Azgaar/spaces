import React from "react";
import {Route, Redirect} from "react-router-dom";
import {useUser} from "../hooks";
import {UserRole} from "../types";

type RouteProps = {
  path: string,
  role: UserRole,
  component: React.FC
}

const PrivateRoute = ({path, role, component}: RouteProps) => {
  const {isAuthenticated, isAdmin} = useUser();

  if (role === UserRole.USER && !isAuthenticated) return <Redirect to="/signin" />;
  if (role === UserRole.ADMIN && !isAdmin) return <Redirect to="/dashboard" />;
  return <Route path={path} component={component} />;
};

export {PrivateRoute};

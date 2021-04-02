import React from "react";
import {Route, Redirect} from "react-router-dom";
import {useUser} from "../hooks";

enum AccessRole {
  UNLOGGED = "unlogged",
  LOGGED = "logged",
  ADMIN = "admin"
};

const PrivateRoute = (props: {path: string; access: AccessRole, component: React.FC}) => {
  const {isAuthenticated, isAdmin} = useUser();

  if (props.access === AccessRole.UNLOGGED && isAuthenticated) return <Redirect to="/dashboard" />;
  if (props.access === AccessRole.LOGGED && !isAuthenticated) return <Redirect to="/signin" />;
  if (props.access === AccessRole.ADMIN && !isAdmin) return <Redirect to="/dashboard" />;
  return <Route path={props.path} component={props.component} />;
};

export {PrivateRoute, AccessRole};

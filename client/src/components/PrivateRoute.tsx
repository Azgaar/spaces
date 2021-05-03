import React from "react";
import {Route, Redirect} from "react-router-dom";
import {useUser} from "../hooks";

enum AccessRole {
  UNLOGGED = "unlogged",
  LOGGED = "logged",
  ADMIN = "admin"
};

type RouteProps = {
  path: string,
  access: AccessRole,
  component: React.FC
}

const PrivateRoute = ({path, access, component}: RouteProps) => {
  const {isAuthenticated, isAdmin} = useUser();
  console.log("PrivateRoute", {path, isAuthenticated, isAdmin});

  if (access === AccessRole.UNLOGGED && isAuthenticated) return <Redirect to="/dashboard" />;
  if (access === AccessRole.LOGGED && !isAuthenticated) return <Redirect to="/signin" />;
  if (access === AccessRole.ADMIN && !isAdmin) return <Redirect to="/dashboard" />;
  return <Route path={path} component={component} />;
};

export {PrivateRoute, AccessRole};

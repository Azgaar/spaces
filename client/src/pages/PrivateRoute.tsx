import React from "react";
import {Route, Redirect} from "react-router-dom";
import {useUser} from "../hooks";

const PrivateRoute = (props: {path: string; adminOnly?: boolean, component: React.FC}) => {
  const {isAuthenticated, isAdmin} = useUser();
  console.log(props, useUser());

  if (!isAuthenticated) return <Redirect to="/signin" />;
  if (props.adminOnly && !isAdmin) return <Redirect to="/dashboard" />;
  return <Route path={props.path} component={props.component} />;
};

export default PrivateRoute;

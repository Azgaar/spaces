import React from "react";
import {Route, Redirect} from "react-router-dom";
import {useAuth} from "../hooks";

const PrivateRoute: React.FC<{path: string; component: React.FC}> = props => {
  const {isAuthenticated} = useAuth();
  return isAuthenticated ? <Route path={props.path} component={props.component} /> : <Redirect to="/signin" />;
};

export default PrivateRoute;

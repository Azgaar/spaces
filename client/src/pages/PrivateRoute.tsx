import React from "react";
import {Route, Redirect} from "react-router-dom";
import {useUser} from "../hooks";

const PrivateRoute: React.FC<{path: string; component: React.FC}> = props => {
  const {isAuthenticated} = useUser();
  return isAuthenticated ? <Route path={props.path} component={props.component} /> : <Redirect to="/signin" />;
};

export default PrivateRoute;

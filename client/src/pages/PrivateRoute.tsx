import React from "react";
import {Route, Redirect} from "react-router-dom";
import {useSelector} from "react-redux";
import {RootState} from "../types";

const PrivateRoute: React.FC<{path: string; component: React.FC}> = props => {
  const isLogged = useSelector((state: RootState) => state.user.logged);
  return isLogged ? <Route path={props.path} component={props.component} /> : <Redirect to="/signin" />;
};

export default PrivateRoute;

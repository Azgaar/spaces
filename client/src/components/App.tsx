import React, {Suspense} from "react";
import {Switch, Route, Redirect} from "react-router-dom";
import Layout from "./Layout/Layout";
import Spinner from "./Spinner/Spinner";
import {PrivateRoute} from "./PrivateRoute";
import {UserRole} from "../types";

const Signin = React.lazy(() => import("../pages/Signin/Signin"));
const Signup = React.lazy(() => import("../pages/Signup/Signup"));
const ForgotPassword = React.lazy(() => import("../pages/ForgotPassword/ForgotPassword"));
const Profile = React.lazy(() => import("../pages/Profile/Profile"));
const ProfileEdit = React.lazy(() => import("../pages/Profile/ProfileEdit/ProfileEdit"));
const PasswordChange = React.lazy(() => import("../pages/Profile/PasswordChange/PasswordChange"));
const Dashboard = React.lazy(() => import("../pages/Dashboard/Dashboard"));
const Users = React.lazy(() => import("../pages/Users/Users"));
const Workspaces = React.lazy(() => import("../pages/Workspaces/Workspaces"));
const Reservations = React.lazy(() => import("../pages/Reservations/Reservations"));

function App() {
  return (
    <Layout>
      <Suspense fallback={<Spinner />}>
        <Switch>
          <Route exact path="/"><Redirect to="/dashboard" /></Route>
          <Route path="/signin" component={Signin} />
          <Route path="/signup" component={Signup} />
          <Route path="/forgotPassword" component={ForgotPassword} />
          <PrivateRoute path="/profile" role={UserRole.USER} component={Profile} />
          <PrivateRoute path="/editProfile" role={UserRole.USER} component={ProfileEdit} />
          <PrivateRoute path="/changePassword" role={UserRole.USER} component={PasswordChange} />
          <PrivateRoute path="/dashboard" role={UserRole.USER} component={Dashboard} />
          <PrivateRoute path="/users" role={UserRole.ADMIN} component={Users} />
          <PrivateRoute path="/workspaces" role={UserRole.ADMIN} component={Workspaces} />
          <PrivateRoute path="/reservations" role={UserRole.ADMIN} component={Reservations} />
          <Route path="/*"><Redirect to="/dashboard" /></Route>
        </Switch>
      </Suspense>
    </Layout>
  );
}

export default App;

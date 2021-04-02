import React, {Suspense} from "react";
import {Switch, Route, Redirect} from "react-router-dom";
import Layout from "./Layout/Layout";
import Spinner from "./Spinner/Spinner";
import {PrivateRoute, AccessRole} from "../pages/PrivateRoute";

const Signin = React.lazy(() => import("../pages/Signin/Signin"));
const Signup = React.lazy(() => import("../pages/Signup/Signup"));
const Logout = React.lazy(() => import("../pages/Logout/Logout"));
const Profile = React.lazy(() => import("../pages/Profile/Profile"));
const ProfileEdit = React.lazy(() => import("../pages/Profile/ProfileEdit/ProfileEdit"));
const PasswordChange = React.lazy(() => import("../pages/Profile/PasswordChange/PasswordChange"));
const Dashboard = React.lazy(() => import("../pages/Dashboard/Dashboard"));
const ForgotPassword = React.lazy(() => import("../pages/ForgotPassword/ForgotPassword"));
const Users = React.lazy(() => import("../pages/Users/Users"));

function App() {
  return (
    <Layout>
      <Suspense fallback={<Spinner />}>
        <Switch>
          <Route exact path="/"><Redirect to="/dashboard" /></Route>
          <PrivateRoute path="/signin" access={AccessRole.UNLOGGED} component={Signin} />
          <PrivateRoute path="/signup" access={AccessRole.UNLOGGED} component={Signup} />
          <PrivateRoute path="/logout" access={AccessRole.LOGGED} component={Logout} />
          <PrivateRoute path="/profile" access={AccessRole.LOGGED} component={Profile} />
          <PrivateRoute path="/editProfile" access={AccessRole.LOGGED} component={ProfileEdit} />
          <PrivateRoute path="/changePassword" access={AccessRole.LOGGED} component={PasswordChange} />
          <PrivateRoute path="/forgotPassword" access={AccessRole.LOGGED} component={ForgotPassword} />
          <PrivateRoute path="/dashboard" access={AccessRole.LOGGED} component={Dashboard} />
          <PrivateRoute path="/users" access={AccessRole.ADMIN} component={Users} />
          <Route path="/*"><Redirect to="/dashboard" /></Route>
        </Switch>
      </Suspense>
    </Layout>
  );
}

export default App;

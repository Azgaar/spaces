import React, {Suspense} from "react";
import {Switch, Route, Redirect} from "react-router-dom";
import Layout from "./Layout/Layout";
import Spinner from "./Spinner/Spinner";
import PrivateRoute from "../pages/PrivateRoute";

const Signin = React.lazy(() => import("../pages/Signin/Signin"));
const Signup = React.lazy(() => import("../pages/Signup/Signup"));
const Logout = React.lazy(() => import("../pages/Logout/Logout"));
const Profile = React.lazy(() => import("../pages/Profile/Profile"));
const ProfileEdit = React.lazy(() => import("../pages/Profile/ProfileEdit/ProfileEdit"));
const PasswordChange = React.lazy(() => import("../pages/Profile/PasswordChange/PasswordChange"));
const Dashboard = React.lazy(() => import("../pages/Dashboard/Dashboard"));
const ForgotPassword = React.lazy(() => import("../pages/ForgotPassword/ForgotPassword"));

function App() {
  return (
    <Layout>
      <Suspense fallback={<Spinner />}>
        <Switch>
          <Route exact path="/"><Redirect to="/dashboard" /></Route>
          <Route path="/signin" render={() => <Signin />} />
          <Route path="/signup" render={() => <Signup />} />
          <Route path="/forgotPassword" render={() => <ForgotPassword />} />
          <PrivateRoute path="/logout" component={Logout} />
          <PrivateRoute path="/profile" component={Profile} />
          <PrivateRoute path="/editProfile" component={ProfileEdit} />
          <PrivateRoute path="/changePassword" component={PasswordChange} />
          <PrivateRoute path="/dashboard" component={Dashboard} />
          <Route path="/*"><Redirect to="/dashboard" /></Route>
        </Switch>
      </Suspense>
    </Layout>
  );
}

export default App;

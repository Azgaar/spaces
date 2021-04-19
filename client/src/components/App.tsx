import React, {Suspense} from "react";
import {Switch, Route} from "react-router-dom";
import Layout from "./Layout/Layout";
import Spinner from "./Spinner/Spinner";
import {PrivateRoute} from "./PrivateRoute";
import {UserRole} from "../types";

const Home = React.lazy(() => import("../pages/Home/Home"));

const Signin = React.lazy(() => import("../pages/Auth/Signin/Signin"));
const Signup = React.lazy(() => import("../pages/Auth/Signup/Signup"));
const ForgotPassword = React.lazy(() => import("../pages/Auth/ForgotPassword/ForgotPassword"));

const Profile = React.lazy(() => import("../pages/Profile/Profile/Profile"));
const ProfileEdit = React.lazy(() => import("../pages/Profile/ProfileEdit/ProfileEdit"));
const PasswordChange = React.lazy(() => import("../pages/Profile/PasswordChange/PasswordChange"));

const ActiveReservations = React.lazy(() => import("../pages/User/Reservations/ActiveReservations"));
const ReservationsHistory = React.lazy(() => import("../pages/User/Reservations/ReservationsHistory"));

const ManageReservations = React.lazy(() => import("../pages/Admin/Reservations/Reservations"));
const ManageUsers = React.lazy(() => import("../pages/Admin/Users/Users"));
const ManageWorkspaces = React.lazy(() => import("../pages/Admin/Workspaces/Workspaces"));

function App() {
  return (
    <Layout>
      <Suspense fallback={<Spinner />}>
        <Switch>
          <Route exact path="/" component={Home} />

          <Route path="/signin" component={Signin} />
          <Route path="/signup" component={Signup} />
          <Route path="/forgotPassword" component={ForgotPassword} />

          <PrivateRoute path="/profile" role={UserRole.USER} component={Profile} />
          <PrivateRoute path="/editProfile" role={UserRole.USER} component={ProfileEdit} />
          <PrivateRoute path="/changePassword" role={UserRole.USER} component={PasswordChange} />
          
          <PrivateRoute path="/reservations" role={UserRole.USER} component={ActiveReservations} />
          <PrivateRoute path="/history" role={UserRole.USER} component={ReservationsHistory} />

          <PrivateRoute path="/admin/users" role={UserRole.ADMIN} component={ManageUsers} />
          <PrivateRoute path="/admin/workspaces" role={UserRole.ADMIN} component={ManageWorkspaces} />
          <PrivateRoute path="/admin/reservations" role={UserRole.ADMIN} component={ManageReservations} />

          <Route path="/*" component={Home} />
        </Switch>
      </Suspense>
    </Layout>
  );
}

export default App;

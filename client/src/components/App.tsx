import React, {Suspense} from "react";
import {Switch, Route} from "react-router-dom";
import Layout from "./Layout/Layout";
import Spinner from "./Spinner/Spinner";
import {PrivateRoute} from "./PrivateRoute";
import {UserRole} from "../types";

const Home = React.lazy(() => import("../pages/Home/Home"));
const Page404 = React.lazy(() => import("../pages/Page404/Page404"));

const Signin = React.lazy(() => import("../pages/Auth/Signin/Signin"));
const Signup = React.lazy(() => import("../pages/Auth/Signup/Signup"));
const ForgotPassword = React.lazy(() => import("../pages/Auth/ForgotPassword/ForgotPassword"));

const Profile = React.lazy(() => import("../pages/Profile/Profile/Profile"));
const ProfileEdit = React.lazy(() => import("../pages/Profile/ProfileEdit/ProfileEdit"));
const PasswordChange = React.lazy(() => import("../pages/Profile/PasswordChange/PasswordChange"));

const ActiveReservations = React.lazy(() => import("../pages/User/Reservations/ActiveReservations"));
const ReservationsHistory = React.lazy(() => import("../pages/User/Reservations/ReservationsHistory"));
const ReserveWorkspace = React.lazy(() => import("../pages/User/Reserve/ReserveWorkspace"));

const ManageReservations = React.lazy(() => import("../pages/Admin/Reservations/Reservations"));
const ManageRequests = React.lazy(() => import("../pages/Admin/Requests/Requests"));
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

          <PrivateRoute path="/profile" component={Profile} />
          <PrivateRoute path="/editProfile" component={ProfileEdit} />
          <PrivateRoute path="/changePassword" component={PasswordChange} />

          <PrivateRoute path="/reserve" component={ReserveWorkspace} />
          <PrivateRoute path="/reservations" component={ActiveReservations} />
          <PrivateRoute path="/history" component={ReservationsHistory} />

          <PrivateRoute path="/admin/reservations" requiredRole={UserRole.ADMIN} component={ManageReservations} />
          <PrivateRoute path="/admin/requests" requiredRole={UserRole.ADMIN} component={ManageRequests} />
          <PrivateRoute path="/admin/workspaces" requiredRole={UserRole.ADMIN} component={ManageWorkspaces} />
          <PrivateRoute path="/admin/users" requiredRole={UserRole.ADMIN} component={ManageUsers} />

          <Route path="/*" component={Page404} />
        </Switch>
      </Suspense>
    </Layout>
  );
}

export default App;

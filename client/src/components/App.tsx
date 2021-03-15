import React, { Suspense } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import Layout from "./Layout/Layout";
import Spinner from './Spinner/Spinner';
const Home = React.lazy(() => import("../pages/Home/Home"));
const Signin = React.lazy(() => import("../pages/Signin/Signin"));
const Signup = React.lazy(() => import("../pages/Signup/Signup"));

function App() {
  return (
    <Layout>
      <Suspense fallback={<Spinner />}>
        <Switch>
          <Route exact path="/">
            <Redirect to="/signin" />
          </Route>
          <Route path="/home" render={() => <Home />} />
          <Route path="/signin" render={() => <Signin />} />
          <Route path="/signup" render={() => <Signup />} />
        </Switch>
      </Suspense>
    </Layout>
  );
}

export default App;

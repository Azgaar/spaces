import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import Layout from "./Layout/Layout";
import Home from "../pages/Home/Home";
import Signin from "../pages/Signin/Signin";
import Signup from "../pages/Signup/Signup";

function App() {
  return (
    <Layout>
      <Switch>
        <Route exact path="/">
          <Redirect to="/signin" />
        </Route>
        <Route path="/home" render={() => <Home />} />
        <Route path="/signin" render={() => <Signin />} />
        <Route path="/signup" render={() => <Signup />} />
      </Switch>
    </Layout>
  );
}

export default App;

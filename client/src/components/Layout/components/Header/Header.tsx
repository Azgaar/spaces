import React from "react";
import useStyles from "./Header.style";
import {AppBar, Toolbar, Button, Typography} from "@material-ui/core";
import {Link as RouterLink, useHistory} from "react-router-dom";
import {useRequest, useUser} from "../../../../hooks";
import {actions} from "../../../../store/actions";
import {useDispatch} from "react-redux";
import {AuthService} from "../../../../services";

const logoPath = process.env.PUBLIC_URL + "/logo.svg";

const Admin = () => {
  return (<>
    <Button color="inherit" component={RouterLink} to="/workspaces">Workspaces</Button>
    <Button color="inherit" component={RouterLink} to="/users">Users</Button>
  </>
  );
}

const Authorized = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const {handleRequest} = useRequest();

  const handleLogout = async () => {
    const res = await handleRequest(AuthService.logout())
    if (!res) return
    dispatch(actions.logout());
    history.push("/signin");
  }

  return (<>
    <Button color="inherit" component={RouterLink} to="/profile">Profile</Button>
    <Button color="inherit" onClick={handleLogout}>Log Out</Button>
  </>
  );
}

const Unauthorized = () => {
  return (<>
    <Button color="inherit" component={RouterLink} to="/signin">Sign In</Button>
    <Button color="inherit" component={RouterLink} to="/signup">Sign Up</Button>
  </>
  );
}

function Header() {
  const classes = useStyles();
  const {isAuthenticated, isAdmin} = useUser();

  return (
    <AppBar position="static" className={classes.header}>
      <Toolbar>
        <img src={logoPath} className={classes.logo} alt="logo" />
        <Typography variant="h6" component="h1">
          SPɅCES
        </Typography>
        <div className={classes.buttons}>
          {isAuthenticated && <Button color="inherit" component={RouterLink} to="/dashboard">Dashboard</Button>}
          {isAdmin && <Admin />}
          {isAuthenticated ? <Authorized /> : <Unauthorized />}
        </div>
      </Toolbar>
    </AppBar>
  );
}

export default Header;

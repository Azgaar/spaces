import React from "react";
import useStyles from "./Header.style";
import {AppBar, Toolbar, Button, Typography} from "@material-ui/core";
import {Link as RouterLink} from "react-router-dom";
import {useUserData, useAdmin} from "../../../../hooks";

const logoPath = process.env.PUBLIC_URL + "/logo.svg";

const Admin = () => {
  return (<>
    <Button color="inherit" component={RouterLink} to="/user">Users</Button>
  </>
  );
}

const Authorized = () => {
  return (<>
    <Button color="inherit" component={RouterLink} to="/profile">Profile</Button>
    <Button color="inherit" component={RouterLink} to="/logout">Log Out</Button>
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
  const user = useUserData();
  const isAdmin = useAdmin();

  return (
    <AppBar position="static" className={classes.header}>
      <Toolbar>
        <img src={logoPath} className={classes.logo} alt="logo" />
        <Typography variant="h6" component="h1">
          SPɅCES
        </Typography>
        <div className={classes.buttons}>
          {isAdmin && <Admin />}
          {user.isAuthenticated ? <Authorized /> : <Unauthorized />}
        </div>
      </Toolbar>
    </AppBar>
  );
}

export default Header;

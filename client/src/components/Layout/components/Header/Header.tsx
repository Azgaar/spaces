import React from "react";
import useStyles from "./Header.style";
import {AppBar, Toolbar, Button, Typography} from "@material-ui/core";
import {Link as RouterLink, useHistory} from "react-router-dom";
import {useToasterCatcher, useUser} from "../../../../hooks";
import {actions} from "../../../../store/actions";
import {useDispatch} from "react-redux";
import {AuthService} from "../../../../services";

const logoPath = process.env.PUBLIC_URL + "/logo.svg";

const Authorized = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const {catchAndTossError} = useToasterCatcher();

  const handleLogout = async () => {
    const result = await catchAndTossError(AuthService.logout())
    if (!result) return
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

const Admin = () => {
  return (<>
    <Button color="inherit" component={RouterLink} to="/admin/reservations">Reservations</Button>
    <Button color="inherit" component={RouterLink} to="/admin/workspaces">Workspaces</Button>
    <Button color="inherit" component={RouterLink} to="/admin/users">Users</Button>
  </>
  );
}

const User = () => {
  return (<>
    <Button color="inherit" component={RouterLink} to="/reserve">Reserve</Button>
    <Button color="inherit" component={RouterLink} to="/reservations">Reservations</Button>
    <Button color="inherit" component={RouterLink} to="/history">History</Button>
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
          {isAuthenticated && (isAdmin ? <Admin /> : <User />)}
          {isAuthenticated ? <Authorized /> : <Unauthorized />}
        </div>
      </Toolbar>
    </AppBar>
  );
}

export default Header;

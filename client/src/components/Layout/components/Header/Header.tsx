import React, {useState} from "react";
import useStyles from "./Header.style";
import {AppBar, Toolbar, Box, Button, Drawer, List, MenuItem, Typography, useTheme, useMediaQuery} from "@material-ui/core";
import {Link as RouterLink, useHistory} from "react-router-dom";
import {useToasterCatcher, useUser} from "../../../../hooks";
import {actions} from "../../../../store/actions";
import {useDispatch} from "react-redux";
import {AuthService} from "../../../../services";
import MenuIcon from "@material-ui/icons/Menu";

const logoPath = process.env.PUBLIC_URL + "/logo.svg";

const UnauthorizedUserNavButtons = () => {
  return (<>
    <MenuItem color="inherit" component={RouterLink} to="/signin">Sign In</MenuItem>
    <MenuItem color="inherit" component={RouterLink} to="/signup">Sign Up</MenuItem>
  </>
  );
}

const AuthorizedUserNavButtons = () => {
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
    <MenuItem color="inherit" component={RouterLink} to="/profile">Profile</MenuItem>
    <MenuItem color="inherit" onClick={handleLogout}>Log Out</MenuItem>
  </>
  );
}

const AdminNavButtons = () => {
  return (<>
    <MenuItem color="inherit" component={RouterLink} to="/admin/reservations">Reservations</MenuItem>
    <MenuItem color="inherit" component={RouterLink} to="/admin/requests">Requests</MenuItem>
    <MenuItem color="inherit" component={RouterLink} to="/admin/workspaces">Workspaces</MenuItem>
    <MenuItem color="inherit" component={RouterLink} to="/admin/users">Users</MenuItem>
  </>
  );
}

const UserNavButtons = () => {
  return (<>
    <MenuItem color="inherit" component={RouterLink} to="/reserve">Reserve</MenuItem>
    <MenuItem color="inherit" component={RouterLink} to="/reservations">Reservations</MenuItem>
    <MenuItem color="inherit" component={RouterLink} to="/history">History</MenuItem>
  </>
  );
}

function Header() {
  const classes = useStyles();
  const wideScreen = useMediaQuery(useTheme().breakpoints.up("md"));
  const {isAuthenticated, isAdmin} = useUser();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleMenu = () => setMenuOpen(() => true);
  const handleClose = () => setMenuOpen(() => false);

  return (
    <AppBar position="sticky" className={classes.header}>
      <Toolbar>
        <img src={logoPath} className={classes.logo} alt="logo" />
        <Typography variant="h6" component="h1" className={classes.title}>SPɅCES</Typography>

        <Box display="flex">
          {wideScreen ? (
            <>
              {isAuthenticated && (isAdmin ? <AdminNavButtons /> : <UserNavButtons />)}
              {isAuthenticated ? <AuthorizedUserNavButtons /> : <UnauthorizedUserNavButtons />}
            </>
          ) : (
            <>
              <Button onClick={handleMenu} color="inherit" endIcon={<MenuIcon fontSize="large" />}>Menu</Button>
              <Drawer open={menuOpen} onClose={handleClose} anchor="right" className={classes.drawer}>
                <List>
                  {isAuthenticated && (isAdmin ? <AdminNavButtons /> : <UserNavButtons />)}
                  {isAuthenticated ? <AuthorizedUserNavButtons /> : <UnauthorizedUserNavButtons />}
                </List>
              </Drawer>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;

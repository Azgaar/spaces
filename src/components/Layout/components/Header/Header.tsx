import React from "react";
import useStyles from "./Header.style";
import { AppBar, Toolbar, Button, Typography } from "@material-ui/core";

const logoPath = process.env.PUBLIC_URL + "/logo.svg";

function Header() {
  const classes = useStyles();

  return (
    <AppBar position="static" className={classes.header}>
      <Toolbar>
        <img src={logoPath} className={classes.logo} alt="logo" />
        <Typography variant="h6" component="h1">
          SPɅCES
        </Typography>
        <div className={classes.buttons}>
          <Button color="inherit">Sign Up</Button>
          <Button color="inherit">Sign In</Button>
        </div>
      </Toolbar>
    </AppBar>
  );
}

export default Header;

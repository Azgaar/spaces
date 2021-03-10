import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Toolbar, Button, Typography } from "@material-ui/core";
import logoSVG from './logo.svg';

const useStyles = makeStyles((theme) => ({
  header: {
    backgroundColor: '#000000b3',
    color: 'white',
  },
  logo: {
    height: '3em',
  },
  buttons: {
    marginLeft: 'auto',
  },
}));

function Header() {
  const classes = useStyles();

  return (
    <AppBar position="static" className={classes.header}>
      <Toolbar>
        <img src={logoSVG} className={classes.logo} alt="logo" />
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

import React, {useState} from "react";
import useStyles from "./Header.style";
import {AppBar, Toolbar, Box, Button, Drawer, List,  Typography, useTheme, useMediaQuery} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import MenuButtons from "./MenuButtons/MenuButtons";

const logoPath = process.env.PUBLIC_URL + "/logo.svg";

function Header() {
  const classes = useStyles();
  const wideScreen = useMediaQuery(useTheme().breakpoints.up("md"));
  const [menuOpen, setMenuOpen] = useState(false);

  const handleMenu = () => setMenuOpen(() => true);
  const handleClose = () => setMenuOpen(() => false);

  return (
    <AppBar position="sticky" className={classes.header}>
      <Toolbar>
        <img src={logoPath} className={classes.logo} alt="logo" />
        <Typography variant="h6" component="h1" className={classes.title}>SPɅCES</Typography>

        <Box display="flex">
          {wideScreen
            ? <MenuButtons />
            : <Button onClick={handleMenu} color="inherit" endIcon={<MenuIcon fontSize="large" />}>Menu</Button>
          }
        </Box>
      </Toolbar>

      <Drawer open={menuOpen} onClose={handleClose} anchor="right" className={classes.drawer}>
        <List><MenuButtons /></List>
      </Drawer>
    </AppBar>
  );
}

export default Header;

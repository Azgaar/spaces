import React from "react";
import { Container } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Background from './background.jpg';
import Header from "./Header";
import Footer from "./Footer";

const useStyles = makeStyles((theme) => ({
  app: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  },
  background: {
    zIndex: -999,
    position: 'fixed',
    backgroundImage: `url(${Background})`,
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    width: '100vw',
    height: '100vh',
    opacity: .8,
  },
}));

function Layout(props: any) {
  const classes = useStyles();

  return (
    <div className={classes.app}>
      <div className={classes.background}></div>
      <Header />
      <Container component="main" maxWidth="xs">
        {props.children}
      </Container>
      <Footer />
    </div>
  );
}

export default Layout;

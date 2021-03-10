import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Container } from '@material-ui/core';
import Header from './Header';
import Signup from './Signup';
import Footer from './Footer';
import Background from './background.jpg';

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

function App() {
  const classes = useStyles();

  return (
    <div className={classes.app}>
      <div className={classes.background}></div>
      <Header />
      <Container component="main" maxWidth="xs">
        <Signup />
      </Container>
      <Footer />
    </div>
  );
}

export default App;

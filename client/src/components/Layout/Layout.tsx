import React, {FC} from 'react';
import useStyles from './Layout.style';
import {Container} from '@material-ui/core';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import ErrorBoundary from '../ErrorBoundary';

const Layout: FC = ({children}) => {
  const classes = useStyles();

  return (
    <div className={classes.app}>
      <div className={classes.background}></div>
      <Header />
      <Container component="main" role="main" maxWidth="lg">
        <ErrorBoundary children={children} />
      </Container>
      <Footer />
    </div>
  );
};

export default Layout;

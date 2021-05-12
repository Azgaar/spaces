import React, {FC} from 'react';
import useStyles from './Layout.style';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import ErrorBoundary from '../ErrorBoundary';

const Layout: FC = ({children}) => {
  const classes = useStyles();

  return (
    <div className={classes.app}>
      <div className={classes.background}></div>
      <Header />
      <ErrorBoundary children={children} />
      <Footer />
    </div>
  );
};

export default Layout;

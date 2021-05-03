import React from 'react';
import useStyles from './Footer.style';
import Container from '@material-ui/core/Container';
import Copyright from './Copyright/Copyright';

function Footer() {
  const classes = useStyles();

  return (
    <footer className={classes.footer}>
      <Container maxWidth="sm">
        <Copyright />
      </Container>
    </footer>
  );
}

export default Footer;

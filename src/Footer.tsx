import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Copyright from './Copyright';

const useStyles = makeStyles((theme) => ({
  footer: {
    padding: theme.spacing(2.8, 2, 2, 2),
    marginTop: 'auto',
    backgroundColor: '#eeeeee30',
  }
}));

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

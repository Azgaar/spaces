import React, {FC} from 'react';
import useStyles from './Footer.style';
import Container from '@material-ui/core/Container';
import Copyright from './Copyright/Copyright';

const Footer: FC = () => {
  const classes = useStyles();

  return (
    <footer className={classes.footer}>
      <Container maxWidth="sm">
        <Copyright />
      </Container>
    </footer>
  );
};

export default Footer;

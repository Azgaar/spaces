import React from 'react';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://spaces.herokuapp.com/">
        SPɅCES: Workspace Reservation System
      </Link>{', '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

export default Copyright;

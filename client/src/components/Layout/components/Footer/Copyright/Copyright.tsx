import React, {FC} from 'react';
import {Typography, Link} from '@material-ui/core';

const Copyright: FC = () => {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://spaces.herokuapp.com/">
        SPɅCES: Workspace Reservation System
      </Link>
      {', '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
};

export default Copyright;

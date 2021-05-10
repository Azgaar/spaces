import React, {FC} from 'react';
import {Typography, Link} from '@material-ui/core';
import {CLIENT_URL} from '../../../../../config';

const Copyright: FC = () => {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href={CLIENT_URL}>
        SPɅCES: Workspace Reservation System
      </Link>
      {', '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
};

export default Copyright;

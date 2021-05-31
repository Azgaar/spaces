import React, {ElementType, ReactElement} from 'react';
import useStyles from './Headline.style';
import {Box, Avatar, Typography} from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import ListAltOutlinedIcon from '@material-ui/icons/ListAltOutlined';
import MailOutlineOutlinedIcon from '@material-ui/icons/MailOutlineOutlined';
import AccountCircleOutlinedIcon from '@material-ui/icons/AccountCircleOutlined';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import PeopleAltOutlinedIcon from '@material-ui/icons/PeopleAltOutlined';
import DesktopWindowsIcon from '@material-ui/icons/DesktopWindows';
import AirplayIcon from '@material-ui/icons/Airplay';
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
import CollectionsBookmarkIcon from '@material-ui/icons/CollectionsBookmark';
import BookIcon from '@material-ui/icons/Book';
import TodayIcon from '@material-ui/icons/Today';
import DateRangeIcon from '@material-ui/icons/DateRange';
import RoomServiceIcon from '@material-ui/icons/RoomService';
import MoodBadIcon from '@material-ui/icons/MoodBad';
import AccountTreeIcon from '@material-ui/icons/AccountTree';

const HeadlineIconDefault: ElementType = HelpOutlineIcon;
const HeadlineIconMap: {[key: string]: ElementType} = {
  'Sign in': LockOutlinedIcon,
  'Sign up': ListAltOutlinedIcon,
  'Forgot Password': MailOutlineOutlinedIcon,
  Profile: AccountCircleOutlinedIcon,
  'Edit Profile': AccountCircleOutlinedIcon,
  'Change Password': AccountCircleOutlinedIcon,
  'Manage Users': PeopleAltOutlinedIcon,
  'Edit Layout': AccountTreeIcon,
  'Manage Workspaces': DesktopWindowsIcon,
  'Add Workspace': AirplayIcon,
  'Edit Workspace': AirplayIcon,
  'Manage Reservations': LibraryBooksIcon,
  'Add Reservation': CollectionsBookmarkIcon,
  'Edit Reservation': CollectionsBookmarkIcon,
  'Reserve Workspace': BookIcon,
  'Active Reservations': TodayIcon,
  'Reservations History': DateRangeIcon,
  'Request Services': RoomServiceIcon,
  'Manage Service Requests': RoomServiceIcon,
  'Error 404': MoodBadIcon
};

function Headline({pagename}: {pagename: string}): ReactElement {
  const classes = useStyles();
  const IconComponent = HeadlineIconMap[pagename] || HeadlineIconDefault;

  return (
    <Box className={classes.box}>
      <Avatar className={classes.avatar}>
        <IconComponent />
      </Avatar>
      <Typography component="h1" variant="h5" role="heading">
        {pagename}
      </Typography>
    </Box>
  );
}

export default Headline;

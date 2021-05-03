import React, {ElementType, ReactElement} from 'react';
import useStyles from './Headline.style';
import {Avatar, Typography} from '@material-ui/core';
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

const HeadlineIconDefault: ElementType = HelpOutlineIcon;
const HeadlineIconMap: {[key: string]: ElementType} = {
  'Manage Users': PeopleAltOutlinedIcon,
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
    <>
      <Avatar className={classes.avatar}>
        <IconComponent />
      </Avatar>
      <Typography component="h1" variant="h5" className={classes.header}>
        {pagename}
      </Typography>
    </>
  );
}

export default Headline;

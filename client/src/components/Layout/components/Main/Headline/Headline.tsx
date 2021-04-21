import React, {ElementType, ReactElement} from "react";
import useStyles from "./Headline.style";
import {Avatar, Typography} from "@material-ui/core";
import DesktopWindowsIcon from "@material-ui/icons/DesktopWindows";

const HeadlineIconDefault: ElementType = DesktopWindowsIcon;
const HeadlineIconMap: {[key: string]: ElementType} = {
  "Manage Workspaces": DesktopWindowsIcon,
}

function Headline({pagename}: {pagename: string}): ReactElement {
  const classes = useStyles();
  const IconComponent = HeadlineIconMap[pagename] || HeadlineIconDefault;

  return (<>
    <Avatar className={classes.avatar}>
      <IconComponent />
    </Avatar>
    <Typography component="h1" variant="h5" className={classes.header}>{pagename}</Typography>
  </>)
}

export default Headline;

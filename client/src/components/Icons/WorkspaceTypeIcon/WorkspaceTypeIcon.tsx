import React, {ElementType, ReactElement} from "react";
import DesktopWindowsIcon from "@material-ui/icons/DesktopWindows";
import GroupWorkOutlinedIcon from "@material-ui/icons/GroupWorkOutlined";
import VolumeOffOutlinedIcon from "@material-ui/icons/VolumeOffOutlined";
import RouterOutlinedIcon from "@material-ui/icons/RouterOutlined";
import WbIncandescentOutlinedIcon from "@material-ui/icons/WbIncandescentOutlined";
import SportsEsportsOutlinedIcon from "@material-ui/icons/SportsEsportsOutlined";
import AirlineSeatFlatOutlinedIcon from "@material-ui/icons/AirlineSeatFlatOutlined";
import RoomIcon from "@material-ui/icons/Room";
import {WorkspaceType} from "../../../types";

const WorkspaceTypeIconDefault: ElementType = RoomIcon;
const WorkspaceTypeIconMap: {[key: string]: ElementType} = {
  [WorkspaceType.DESK]: DesktopWindowsIcon,
  [WorkspaceType.MEETING_ROOM]: WbIncandescentOutlinedIcon,
  [WorkspaceType.CONFERENCE_ROOM]: RouterOutlinedIcon,
  [WorkspaceType.COWORKING]: GroupWorkOutlinedIcon,
  [WorkspaceType.FOCUS_ROOM]: VolumeOffOutlinedIcon,
  [WorkspaceType.FUN_ZONE]: SportsEsportsOutlinedIcon,
  [WorkspaceType.NAP_POD]: AirlineSeatFlatOutlinedIcon
}

const WorkspaceTypeIcon = ({value}: {value: WorkspaceType}): ReactElement => {
  const IconComponent = WorkspaceTypeIconMap[value] || WorkspaceTypeIconDefault;
  return <IconComponent/>;
}

export default WorkspaceTypeIcon;

import DesktopWindowsIcon from "@material-ui/icons/DesktopWindows";
import GroupWorkOutlinedIcon from "@material-ui/icons/GroupWorkOutlined";
import VolumeOffOutlinedIcon from "@material-ui/icons/VolumeOffOutlined";
import RouterOutlinedIcon from "@material-ui/icons/RouterOutlined";
import WbIncandescentOutlinedIcon from "@material-ui/icons/WbIncandescentOutlined";
import SportsEsportsOutlinedIcon from "@material-ui/icons/SportsEsportsOutlined";
import AirlineSeatFlatOutlinedIcon from "@material-ui/icons/AirlineSeatFlatOutlined";
import RoomIcon from "@material-ui/icons/Room";
import {WorkspaceType} from "../../../types";

const WorkspaceTypeIcon = ({type}: {type: WorkspaceType}): React.ReactElement => {
  switch (type) {
    case WorkspaceType.DESK: return <DesktopWindowsIcon />;
    case WorkspaceType.MEETING_ROOM: return <WbIncandescentOutlinedIcon />;
    case WorkspaceType.CONFERENCE_ROOM: return <RouterOutlinedIcon />;
    case WorkspaceType.COWORKING: return <GroupWorkOutlinedIcon />;
    case WorkspaceType.FOCUS_ROOM: return <VolumeOffOutlinedIcon />;
    case WorkspaceType.FUN_ZONE: return <SportsEsportsOutlinedIcon />;
    case WorkspaceType.NAP_POD: return <AirlineSeatFlatOutlinedIcon />;
    default: return <RoomIcon />;
  }
}

export default WorkspaceTypeIcon;

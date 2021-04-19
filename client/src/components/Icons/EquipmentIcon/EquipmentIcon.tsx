import PersonalVideoIcon from "@material-ui/icons/PersonalVideo";
import RouterIcon from "@material-ui/icons/Router";
import WeekendIcon from "@material-ui/icons/Weekend";
import PhoneIcon from "@material-ui/icons/Phone";
import HeadsetMicIcon from "@material-ui/icons/HeadsetMic";
import SpeakerPhoneIcon from "@material-ui/icons/SpeakerPhone";
import DirectionsWalkIcon from "@material-ui/icons/DirectionsWalk";
import PhonelinkSetupIcon from '@material-ui/icons/PhonelinkSetup';
import {Equipment} from "../../../types";

const EquipmentIcon = ({value}: {value: Equipment}): React.ReactElement => {
  switch (value) {
    case Equipment.PROJECTOR: return <RouterIcon />;
    case Equipment.MONITOR: return <PersonalVideoIcon />;
    case Equipment.TELEPHONE: return <PhoneIcon />;
    case Equipment.SPEAKERPHONE: return <SpeakerPhoneIcon />;
    case Equipment.STANDING_DESK: return <DirectionsWalkIcon />;
    case Equipment.HEADSET: return <HeadsetMicIcon />;
    case Equipment.COUCH: return <WeekendIcon />;
    default: return <PhonelinkSetupIcon />;
  }
}

export default EquipmentIcon;

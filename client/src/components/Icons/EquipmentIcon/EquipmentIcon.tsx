import React, {ReactElement} from "react";
import PersonalVideoIcon from "@material-ui/icons/PersonalVideo";
import RouterIcon from "@material-ui/icons/Router";
import WeekendIcon from "@material-ui/icons/Weekend";
import PhoneIcon from "@material-ui/icons/Phone";
import HeadsetMicIcon from "@material-ui/icons/HeadsetMic";
import SpeakerPhoneIcon from "@material-ui/icons/SpeakerPhone";
import DirectionsWalkIcon from "@material-ui/icons/DirectionsWalk";
import PhonelinkSetupIcon from '@material-ui/icons/PhonelinkSetup';
import {Equipment} from "../../../types";

const EquipmentIconMap = {
  [Equipment.PROJECTOR]: RouterIcon,
  [Equipment.MONITOR]: PersonalVideoIcon,
  [Equipment.TELEPHONE]: PhoneIcon,
  [Equipment.SPEAKERPHONE]: SpeakerPhoneIcon,
  [Equipment.STANDING_DESK]: DirectionsWalkIcon,
  [Equipment.HEADSET]: HeadsetMicIcon,
  [Equipment.COUCH]: WeekendIcon
}

const EquipmentIcon = ({value}: {value: Equipment}): ReactElement => {
  const IconComponent = EquipmentIconMap[value];
  return IconComponent ? <IconComponent/> : <PhonelinkSetupIcon />
}

export default EquipmentIcon;

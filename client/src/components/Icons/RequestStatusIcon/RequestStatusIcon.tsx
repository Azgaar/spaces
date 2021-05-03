import React, {ElementType, ReactElement} from 'react';
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';
import DoneOutlineIcon from '@material-ui/icons/DoneOutline';
import BlockIcon from '@material-ui/icons/Block';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import {ServiceRequestStatus} from '../../../types';

const RequestStatusIconDefault: ElementType = HelpOutlineIcon;
const RequestStatusIconMap: {[key: string]: ElementType} = {
  [ServiceRequestStatus.PENDING]: HourglassEmptyIcon,
  [ServiceRequestStatus.FULFILLED]: DoneOutlineIcon,
  [ServiceRequestStatus.REJECTED]: BlockIcon
};

const RequestStatusIcon = ({value}: {value: ServiceRequestStatus}): ReactElement => {
  const IconComponent = RequestStatusIconMap[value] || RequestStatusIconDefault;
  return <IconComponent fontSize="small" />;
};

export default RequestStatusIcon;

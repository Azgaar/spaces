import {Schema, model} from 'mongoose';
import {ReservationDocument, ReservationStatus, WorkspaceStatus, WorkspaceType, Equipment} from '../types';

const required = true;
const reservationSchema = new Schema(
  {
    location: {type: Schema.Types.ObjectId, ref: 'Location', required},
    workspace: {type: Schema.Types.ObjectId, ref: 'Workspace', required},
    requester: {type: String, required},
    from: {type: Date, required},
    to: {type: Date, required},
    requests: {type: [{type: Schema.Types.ObjectId, ref: 'Service'}], required: false}
  },
  {timestamps: true, versionKey: false}
);

const getWorkspaceAttributes = (workspace: ReservationJSON['workspace']) => {
  const {id, description, type, size} = workspace;
  return {workspace: id, description, type, size};
};

const getLocationAttributes = (location: ReservationJSON['location']) => {
  return {locationDescription: location.description, location: location.id};
};

const getStatus = (from: Date, to: Date): ReservationStatus => {
  const now = new Date();
  if (to < now) {
    return ReservationStatus.PAST;
  }
  if (from > now) {
    return ReservationStatus.FUTURE;
  }
  return ReservationStatus.CURRENT;
};

reservationSchema.set('toJSON', {
  transform: (doc: ReservationDocument, ret: ReservationJSON) => {
    const {_id, location, workspace, requester, from, to, requests} = ret;
    const workspaceAttributes = getWorkspaceAttributes(workspace);
    const locationAttributes = getLocationAttributes(location);
    const status = getStatus(from, to);
    const reservation = {id: _id, requester, from, to, status, ...workspaceAttributes, ...locationAttributes, requests};
    return reservation;
  }
});

interface ReservationJSON {
  _id: string;
  location: {
    id: string;
    description: string;
  };
  workspace: {
    id: string;
    description: string;
    location: string;
    status: WorkspaceStatus;
    type: WorkspaceType;
    size: number;
    equipment: Equipment[];
  };
  requester: string;
  from: Date;
  to: Date;
  requests: string[];
}

export const Reservation = model<ReservationDocument>('Reservation', reservationSchema);

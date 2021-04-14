import {Schema, model} from "mongoose";
import {ReservationDocument, WorkspaceDocument, ReservationStatus, WorkspaceStatus, WorkspaceType, Equipment} from "../types";

const required = true;
const reservationSchema = new Schema(
  {
    location: {type: Schema.Types.ObjectId, required},
    workspace: {type: Schema.Types.ObjectId, ref: "Workspace", required},
    requester: {type: String, required},
    from: {type: Date, required},
    to: {type: Date, required}
  },
  {timestamps: true, versionKey: false}
);

const getWorkspaceAttributes = (workspace: ReservationJSON["workspace"]) => {
  const {id, description, type, size} = workspace;
  return {workspace: id, description, type, size};
}

const getStatus = (from: Date, to: Date): ReservationStatus => {
  const now = new Date();
  if (to < now) return ReservationStatus.PAST;
  if (from > now) return ReservationStatus.FUTURE;
  return ReservationStatus.CURRENT;
}

reservationSchema.set("toJSON", {
  transform: (doc: ReservationDocument, ret: ReservationJSON) => {
    const {_id, location, workspace, requester, from, to} = ret;
    const ws = getWorkspaceAttributes(workspace);
    const status = getStatus(from, to);
    const reservation = {id: _id, location, requester, from, to, status, ...ws};
    return reservation;
  }
});

interface ReservationJSON {
  _id: string;
  location: string;
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
}

export const Reservation = model<ReservationDocument>("Reservation", reservationSchema);

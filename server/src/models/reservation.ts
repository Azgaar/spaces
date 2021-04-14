import {Schema, model} from "mongoose";
import {ReservationDocument, WorkspaceDocument, ReservationStatus} from "../types";

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

const getWorkspaceAttributes = (workspace: WorkspaceDocument) => {
  const {_id, description, type, size} = workspace as WorkspaceDocument;
  return {workspace: _id, description, type, size};
}

const getStatus = (from: Date, to: Date): ReservationStatus => {
  const now = new Date();
  if (to < now) return ReservationStatus.PAST;
  if (from > now) return ReservationStatus.FUTURE;
  return ReservationStatus.CURRENT;
}

reservationSchema.set("toJSON", {
  transform: (doc: ReservationDocument, ret: ReservationDocument) => {
    const {_id, location, workspace, requester, from, to} = ret;
    const ws = getWorkspaceAttributes(workspace as WorkspaceDocument);
    const status = getStatus(from, to);
    const reservation = {id: _id, location, requester, from, to, status, ...ws};
    return reservation;
  }
});

export const Reservation = model<ReservationDocument>("Reservation", reservationSchema);

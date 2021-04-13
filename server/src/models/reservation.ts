import {Schema, model} from "mongoose";
import {ReservationDocument, ReservationData} from "../types";

const required = true;
const reservationSchema = new Schema(
  {
    location: {type: Schema.Types.ObjectId, required},
    workspace: {type: Schema.Types.ObjectId, required},
    requester: {type: String, required},
    from: {type: Date, required},
    to: {type: Date, required}
  },
  {timestamps: true, versionKey: false}
);

reservationSchema.set("toJSON", {
  transform: (doc: ReservationDocument, ret: ReservationDocument) => {
    const {_id, location, workspace, requester, from, to} = ret;
    const reservationData: ReservationData = {id: _id, location, workspace, requester, from, to};
    return reservationData;
  }
});

export const Reservation = model<ReservationDocument>("Reservation", reservationSchema);

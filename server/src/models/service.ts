import {Schema, model} from "mongoose";
import {ServiceDocument, ServiceRequestStatus} from "../types";

const required = true;
const serviceSchema = new Schema(
  {
    reservation: {type: Schema.Types.ObjectId, ref: "Reservation", required},
    description: {type: String, required},
    requester: {type: String, required},
    status: {type: String, enum: ServiceRequestStatus, required}
  },
  {timestamps: true, versionKey: false}
);

serviceSchema.set("toJSON", {
  transform: (doc: ServiceDocument, ret: ServiceJSON) => {
    const {_id, requester, description, status, createdAt, updatedAt} = ret;
    const serviceRequest = {id: _id, requester, description, status, createdAt, updatedAt};
    return serviceRequest;
  }
});

interface ServiceJSON {
  _id: string;
  requester: string;
  description: string;
  status: ServiceRequestStatus;
  createdAt: Date;
  updatedAt: Date;
}

export const Service = model<ServiceDocument>("Service", serviceSchema);

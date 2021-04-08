import {Schema, model} from "mongoose";
import {WorkspaceDocument} from "../types";

const required = true;
const workspaceSchema = new Schema(
  {
    description: {type: String, required},
    location: {type: Schema.Types.ObjectId, required},
    status: {type: String, enum: ["available", "unavailable"], required},
    type: {type: String, required},
    size: {type: Number, required},
    equipment: [{type: String}]
  },
  {timestamps: true, versionKey: false}
);

workspaceSchema.set("toJSON", {
  transform: (doc: WorkspaceDocument, ret: WorkspaceDocument) => {
    const {_id, description} = ret;
    return {id: _id, description};
  }
});

export const Workspace = model<WorkspaceDocument>("Workspace", workspaceSchema);

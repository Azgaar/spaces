import {Schema, model} from "mongoose";
import {WorkspaceDocument} from "../types";
import {Location} from "./location";

const workspaceSchema = new Schema(
  {
    description: {
      type: String,
      required: true
    },
    location: {
      type: Location,
      required: true
    },
    status: {
      type: String,
      enum: ["available", "unavailable"],
      required: true
    },
    type: {
      type: String,
      required: true
    },
    size: {
      type: Number,
      required: true
    },
    equipment: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

workspaceSchema.set("toJSON", {
  transform: (doc: WorkspaceDocument, ret: WorkspaceDocument) => {
    const {_id, description} = ret;
    return {id: _id, description};
  }
});

export const Workspace = model<WorkspaceDocument>("Workspace", workspaceSchema);

import {Schema, model} from "mongoose";
import {LocationDocument} from "../types";

const locationSchema = new Schema(
  {description: {type: String, required: true}},
  {timestamps: true, versionKey: false}
);

locationSchema.set("toJSON", {
  transform: (doc: LocationDocument, ret: LocationDocument) => {
    const {_id, description} = ret;
    return {id: _id, description};
  }
});

export const Location = model<LocationDocument>("Location", locationSchema);

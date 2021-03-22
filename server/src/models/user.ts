import {Schema, model, Document} from "mongoose";

export interface UserDocument extends Document {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  admin: boolean;
  verifiedAt: Date;
}

const userSchema = new Schema(
  {
    email: String,
    firstName: String,
    lastName: String,
    password: String,
    admin: Boolean,
    verifiedAt: Date
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export const User = model<UserDocument>("User", userSchema);

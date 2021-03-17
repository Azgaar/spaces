import {Schema, model, Document} from "mongoose";

interface UserDocument extends Document {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  verifiedAt: Date;
}

const userSchema = new Schema(
  {
    email: String,
    firstName: String,
    lastName: String,
    password: String,
    verifiedAt: Date
  }, {
    timestamps: true,
    versionKey: false
  }
);

export const User = model<UserDocument>("User", userSchema);

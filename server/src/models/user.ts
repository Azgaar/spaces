import {Schema, model} from "mongoose";
import {hash} from "bcryptjs";
import {UserDocument} from "../types";

const userSchema = new Schema(
  {
    email: String,
    firstName: String,
    lastName: String,
    password: String,
    role: String,
    verifiedAt: Date
  },
  {
    timestamps: true,
    versionKey: false
  }
);

userSchema.pre<UserDocument>("save", async function () {
  if (this.isModified("password")) {
    this.password = await hash(this.password, 12);
  }
});

export const User = model<UserDocument>("User", userSchema);

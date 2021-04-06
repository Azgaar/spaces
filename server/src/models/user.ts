import {Schema, model} from "mongoose";
import {hash} from "bcryptjs";
import {UserDocument, UserData} from "../types";

const required = true;
const userSchema = new Schema(
  {
    email: {type: String, required},
    firstName: {type: String, required},
    lastName: {type: String, required},
    password: {type: String, required},
    role: {type: String, enum: ["user", "admin"], required}
  },
  {timestamps: true, versionKey: false}
);

userSchema.pre<UserDocument>("save", async function () {
  if (this.isModified("password")) this.password = await hash(this.password, 12);
});

userSchema.set("toJSON", {
  transform: (doc: UserDocument, ret: UserData) => {
    const {email, firstName, lastName, role, createdAt, updatedAt} = ret;
    const created = new Date(String(createdAt)).toUTCString();
    const updated = new Date(String(updatedAt)).toUTCString();
    return {email, firstName, lastName, role, created, updated};
  }
});

export const User = model<UserDocument>("User", userSchema);

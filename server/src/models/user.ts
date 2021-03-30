import {Schema, model} from "mongoose";
import {hash} from "bcryptjs";
import {UserDocument, UserData} from "../types";

const userSchema = new Schema(
  {
    email: String,
    firstName: String,
    lastName: String,
    password: String,
    role: String
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

userSchema.set("toJSON", {
  transform: (doc: UserDocument, ret: UserData) => {
    const {email, firstName, lastName, role} = ret;
    return {email, firstName, lastName, role};
  }
});

export const User = model<UserDocument>("User", userSchema);

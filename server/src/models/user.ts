import {Schema, model} from "mongoose";
import {hash} from "bcryptjs";
import {UserDocument, UserData} from "../types";

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true
    },
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      required: true
    }
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

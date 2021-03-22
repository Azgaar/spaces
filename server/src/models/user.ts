import {Schema, model, Document} from "mongoose";
import {hash} from "bcryptjs";

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

userSchema.pre<UserDocument>("save", async function () {
  if (this.isModified("password")) {
    this.password = await hash(this.password, 12);
  }
});

export const User = model<UserDocument>("User", userSchema);

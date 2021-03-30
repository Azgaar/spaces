import {SessionData} from "express-session";
import {Document} from "mongoose";

declare module "express-session" {
  interface SessionData {
    userId: string;
    createdAt: Date;
  }
}

enum UserRole {
  USER = "user",
  ADMIN = "admin"
};

export interface UserDocument extends Document {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  role: UserRole;
  verifiedAt: Date;
}
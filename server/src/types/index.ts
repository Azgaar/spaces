import {SessionData} from "express-session";
import {Document} from "mongoose";

declare module "express-session" {
  interface SessionData {
    userId: string;
    userRole: UserRole;
    createdAt: Date;
  }
}

export enum UserRole {
  USER = "user",
  ADMIN = "admin"
}

export type UserData = {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  role: UserRole;
}

export interface UserDocument extends Document {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  role: UserRole;
}

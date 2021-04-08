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
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserDocument extends Document {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  role: UserRole;
}

export interface LocationDocument extends Document {
  description: string;
}

export interface WorkspaceDocument extends Document {
  description: string;
}

export type LocationData = {
  description: string;
  id?: string;
}

export enum WorkspaceStatus {
  AVAILABLE = "available",
  UNAVAILABLE = "unavailable"
}

export type WorkspaceData = {
  id?: string;
  description: string;
  location: string;
  status: WorkspaceStatus;
  type: string;
  size: number;
  equipment: string[];
}

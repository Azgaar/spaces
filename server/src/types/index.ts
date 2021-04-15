import {SessionData} from "express-session";
import {Document} from "mongoose";

declare module "express-session" {
  interface SessionData {
    userId: string;
    userEmail: string;
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
  location: string;
  status: WorkspaceStatus;
  type: WorkspaceType;
  size: number;
  equipment: Equipment[];
}

export interface ReservationDocument extends Document {
  location: string;
  workspace: string;
  requester: string;
  from: Date;
  to: Date;
}

export type LocationData = {
  description: string;
  id?: string;
}

export enum WorkspaceStatus {
  AVAILABLE = "Available",
  UNAVAILABLE = "Unavailable"
}

export enum WorkspaceType {
  DESK = "Desk",
  CONFERENCE_ROOM = "Conference room",
  MEETING_ROOM = "Meeting room",
  COWORKING = "Coworking",
  FOCUS_ROOM = "Focus room",
  FUN_ZONE = "Fun zone",
  NAP_POD = "Nap pod"
}

export enum Equipment {
  PROJECTOR = "Projector",
  MONITOR = "Monitor",
  TELEPHONE = "Telephone",
  SPEAKERPHONE = "Speakerphone",
  HEADSET = "Headset",
  STANDING_DESK = "Standing desk",
  COUCH = "Couch"
}

export type WorkspaceData = {
  id?: string;
  description: string;
  location: string;
  status: WorkspaceStatus;
  type: WorkspaceType;
  size: number;
  equipment: Equipment[];
}

export type ReservationData = {
  id?: string;
  location: string;
  workspace: string;
  requester: string;
  from: Date;
  to: Date;
};

export enum ReservationStatus {
  PAST = "Past",
  CURRENT = "Current",
  FUTURE = "Future",
}

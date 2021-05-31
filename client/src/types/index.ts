export enum UserRole {
  USER = 'user',
  ADMIN = 'admin'
}

export type UserData = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
};

export interface RootState {
  user: {
    isAuthenticated: boolean;
    id: string;
    role: UserRole;
    email: string;
    firstName: string;
    lastName: string;
  };
}

export type SignUpForm = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  passwordRepeat: string;
  acceptTerms: boolean;
};

export type SignInForm = {
  email: string;
  password: string;
};

export type ForgotPasswordForm = {
  email: string;
};

export type UserUpdateForm = {
  role: UserRole;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  passwordNew: string;
  passwordNewRepeat: string;
};

export type LocationOption = {
  id: string;
  description: string;
};

export enum WorkspaceStatus {
  AVAILABLE = 'Available',
  UNAVAILABLE = 'Unavailable'
}

export enum WorkspaceType {
  DESK = 'Desk',
  CONFERENCE_ROOM = 'Conference room',
  MEETING_ROOM = 'Meeting room',
  COWORKING = 'Coworking',
  FOCUS_ROOM = 'Focus room',
  FUN_ZONE = 'Fun zone',
  NAP_POD = 'Nap pod'
}

export type WorkspaceSearchCriteria = {
  location: string;
  from: string;
  to: string;
  size?: number;
  type?: WorkspaceType;
  equipment?: Equipment[];
  description?: string;
  excludeReservation?: string;
};

export enum Equipment {
  PROJECTOR = 'Projector',
  MONITOR = 'Monitor',
  TELEPHONE = 'Telephone',
  SPEAKERPHONE = 'Speakerphone',
  HEADSET = 'Headset',
  STANDING_DESK = 'Standing desk',
  COUCH = 'Couch'
}

export type Workspace = {
  id?: string;
  description: string;
  location: string;
  status: WorkspaceStatus;
  type: WorkspaceType;
  size: number;
  equipment: Equipment[];
  x?: number;
  y?: number;
  angle?: number;
};

export type ReservationReq = {
  id?: string;
  location: string;
  workspace: string;
  requester: string;
  from: string;
  to: string;
};

export type ReservationRes = {
  id: string;
  location: string;
  locationDescription: string;
  requester: string;
  from: string;
  to: string;
  workspace: string;
  description: string;
  type: WorkspaceType;
  size: number;
  status: ReservationStatus;
  requests: ServiceRes[];
};

export enum ReservationStatus {
  PAST = 'Past',
  CURRENT = 'Current',
  FUTURE = 'Future'
}

export type ReservationFilters = {
  location: LocationOption;
  from: string;
  to: string;
  size: number;
  type: WorkspaceType | 'Any';
  equipment: Equipment[];
  description: string;
};

export type ServiceReq = {
  location: string;
  reservationId: string;
  requester: string;
  servicesList: string[];
};

export type ServiceRes = {
  id: string;
  location: string;
  description: string;
  status: ServiceRequestStatus;
  requester: string;
};

export enum ServiceRequestStatus {
  PENDING = 'Pending',
  FULFILLED = 'Fulfilled',
  REJECTED = 'Rejected'
}

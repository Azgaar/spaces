export enum UserRole {
  USER = "user",
  ADMIN = "admin"
};

export type UserData = {
  email: string;
  firstName: string
  lastName: string;
  role?: UserRole;
}

export interface RootState {
  user: {
    isAuthenticated: boolean;
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

export type ProfileForm = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  passwordNew: string;
  passwordRepeat: string;
}

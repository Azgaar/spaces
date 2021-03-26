export interface RootState {
  user: {
    logged: boolean;
    role: "user" | "admin";
    email: string;
    firstName: string;
    lastName: string;
  }
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

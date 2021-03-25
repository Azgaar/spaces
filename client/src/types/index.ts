export type SignupForm = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  passwordRepeat: string;
  acceptTerms: boolean;
};

export type SigninForm = {
  email: string;
  password: string;
};

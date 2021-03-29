import {post} from "../utils";
import {SignUpForm, SignInForm} from "../types";

export const signup = (credentials: SignUpForm) => post("/register", true, JSON.stringify(credentials));
export const signin = (credentials: SignInForm) => post("/login", true, JSON.stringify(credentials));
export const logout = () => post("/logout", true);

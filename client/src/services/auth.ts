import {post} from "../utils";
import {SignUpForm, SignInForm} from "../types";

export const signup = (credentials: SignUpForm) => post("/register", JSON.stringify(credentials));
export const signin = (credentials: SignInForm) => post("/login", JSON.stringify(credentials));

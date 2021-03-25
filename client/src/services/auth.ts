import {post} from "../utils";
import {SignupForm, SigninForm} from "../types";

export const signup = (credentials: SignupForm) => post("/register", JSON.stringify(credentials));
export const signin = (credentials: SigninForm) => post("/login", JSON.stringify(credentials));

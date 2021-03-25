import {post} from "../utils";
import {SignupForm, SigninForm} from "../types";

export const register = (credentials: SignupForm) => post("/register", JSON.stringify(credentials));

export const login = (credentials: SigninForm) => post("/login", JSON.stringify(credentials));

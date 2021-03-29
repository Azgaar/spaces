import axios from "axios";
import {SignUpForm, SignInForm} from "../types";

export const signup = (credentials: SignUpForm) => post("/register", true, credentials);
export const signin = (credentials: SignInForm) => post("/login", true, credentials);
export const logout = () => post("/logout", true);

async function post(endpoint: string, withCredentials: boolean, data?: SignUpForm | SignInForm) {
  try {
    const res = await axios.post(endpoint, data, {withCredentials});
    return {...res.data, ok: true};
  } catch (error) {
    return error.response?.data || error;
  }
}

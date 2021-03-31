import axios from "axios";
import {SignUpForm, SignInForm, ProfileForm} from "../types";

export const signup = (credentials: SignUpForm) => post("/register", credentials);
export const signin = (credentials: SignInForm) => post("/login", credentials);
export const logout = () => post("/logout");
export const fetchUserData = () => post("/checkin");
export const updateUserData = (credentials: ProfileForm) => post("/updateUser", credentials);

async function post(endpoint: string, data?: SignUpForm | SignInForm | ProfileForm) {
  try {
    const res = await axios.post(endpoint, data, {withCredentials: true});
    return {...res.data, ok: true};
  } catch (error) {
    return error.response?.data || error;
  }
}

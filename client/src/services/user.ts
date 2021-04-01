import axios from "axios";
import {SignUpForm, SignInForm, ProfileEditForm, PassportChangeForm, ForgotPasswordForm} from "../types";

export const signup = (data: SignUpForm) => post("/register", data);
export const signin = (data: SignInForm) => post("/login", data);
export const logout = () => post("/logout");
export const fetchUserData = () => post("/checkin");
export const updateUserData = (data: ProfileEditForm) => post("/updateUser", data);
export const changePassword = (data: PassportChangeForm) => post("/changePassword", data);
export const forgotPassword = (data: ForgotPasswordForm) => post("/forgotPassword", data);

type Data = SignUpForm | SignInForm | ProfileEditForm | PassportChangeForm | ForgotPasswordForm;
async function post(endpoint: string, data?: Data) {
  try {
    const res = await axios.post(endpoint, data, {withCredentials: true});
    return {...res.data, ok: true};
  } catch (error) {
    return error.response?.data || error;
  }
}

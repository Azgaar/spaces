import axios, {AxiosPromise} from "axios";
import {ForgotPasswordForm, PassportChangeForm, ProfileEditForm, SignInForm} from "../types";

const signup = (formData: SignInForm): AxiosPromise => axios.post("/register", formData);
const fetch = (): AxiosPromise => axios.post("/checkin");
const update = (formData: ProfileEditForm) => axios.post("/updateUser", formData);
const changePassword = (formData: PassportChangeForm) => axios.post("/changePassword", formData);
const resetPassword = (formData: ForgotPasswordForm) => axios.post("/forgotPassword", formData);

export const UserService = {signup, fetch, update, changePassword, resetPassword};

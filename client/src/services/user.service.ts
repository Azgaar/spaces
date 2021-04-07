import axios, {AxiosPromise} from "axios";
import {ForgotPasswordForm, PassportChangeForm, ProfileEditForm, SignInForm} from "../types";
import {GridRowId} from "@material-ui/data-grid";

const signup = (formData: SignInForm): AxiosPromise => axios.post("/register", formData);
const fetch = (): AxiosPromise => axios.post("/checkin");
const update = (formData: ProfileEditForm): AxiosPromise => axios.post("/updateUser", formData);
const changePassword = (formData: PassportChangeForm): AxiosPromise => axios.post("/changePassword", formData);
const resetPassword = (formData: ForgotPasswordForm): AxiosPromise => axios.post("/forgotPassword", formData);
const list = (): AxiosPromise => axios.post("/getUsers");
const remove = (selection: GridRowId[]): AxiosPromise => axios.delete("/deleteUsers", {data: selection});

export const UserService = {signup, fetch, update, changePassword, resetPassword, list, remove};

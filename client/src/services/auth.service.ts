import axios, {AxiosPromise} from "axios";
import {SignInForm} from "../types";

const signin = (data: SignInForm): AxiosPromise => axios.post("/login", data);
export const logout = (): AxiosPromise => axios.post("/logout");

export const AuthService = {signin, logout};

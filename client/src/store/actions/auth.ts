import {AUTH_USER, UNAUTH_USER} from "./types";
import {UserData} from "../../types";

const login = (userData: UserData) => {
  return {type: AUTH_USER, payload: userData};
};

const logout = () => {
  return {type: UNAUTH_USER};
};

export const actions = {login, logout};

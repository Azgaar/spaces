import {AUTH_USER, UNAUTH_USER} from "./types";

type User = {
  role: "user" | "admin",
  email: string,
  firstName: string,
  lastName: string,
}

const login = (userData: User) => {
  return {type: AUTH_USER, payload: userData}
};

const logout = () => {
  return {type: UNAUTH_USER}
};

export const actions = {login, logout};

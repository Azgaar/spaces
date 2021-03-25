import {SignupForm, SigninForm} from "../types";

export const register = async function loginUser(credentials: SignupForm) {
  return fetch("http://localhost:8080/register", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(credentials)
  }).then(data => data.json()).then(json => console.log(json));
};

export const login = async function loginUser(credentials: SigninForm) {
  return fetch("http://localhost:8080/login", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(credentials)
  }).then(data => data.json()).then(json => console.log(json));
};

import {AUTH_USER, UNAUTH_USER} from "../actions/types";

type userData = {
  email: string;
  firstName: string
  lastName: string;
  role: "user" | "admin";
}

const initState = {
  logged: false,
  role: null,
  email: null,
  firstName: null,
  lastName: null
}

const userReducer = (state = initState, action: {type: string, payload: userData}) => {
  switch (action.type) {
    case AUTH_USER:
      return {
        logged: true,
        role: action.payload.role,
        email: action.payload.email,
        firstName: action.payload.firstName,
        lastName: action.payload.lastName
      };
    case UNAUTH_USER:
      return initState;
    default:
      return state;
  }
};

export default userReducer;
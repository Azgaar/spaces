import {AUTH_USER, UNAUTH_USER} from "../actions/types";
import {UserData} from "../../types";

const initState = {
  isAuthenticated: false,
  role: null,
  email: null,
  firstName: null,
  lastName: null
}

const userReducer = (state = initState, action: {type: string, payload: UserData}) => {
  switch (action.type) {
    case AUTH_USER:
      return {
        isAuthenticated: true,
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
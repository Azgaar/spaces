import {AUTH_USER, UNAUTH_USER} from "../actions/types";

const initialState = {
  logged: false,
  role: null,
  email: null,
  firstName: null,
  lastName: null
}

export const reducer = (state = initialState, action: {type: string, payload: any}) => {
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
      return initialState;
    default:
      return state;
  }
};

import {AUTH_USER, UNAUTH_USER, UPDATE_USER} from '../actions/types';
import {UserData, UserRole} from '../../types';

type UserState = {
  isAuthenticated: boolean;
  role: UserRole | null;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
};

const initState: UserState = {
  isAuthenticated: false,
  role: null,
  email: null,
  firstName: null,
  lastName: null
};

const userReducer = (state = initState, action: {type: string; payload: UserData}): UserState => {
  switch (action.type) {
    case AUTH_USER:
      return {
        isAuthenticated: true,
        role: action.payload.role || null,
        email: action.payload.email,
        firstName: action.payload.firstName,
        lastName: action.payload.lastName
      };
    case UNAUTH_USER:
      return initState;
    case UPDATE_USER:
      return {
        ...state,
        email: action.payload.email,
        firstName: action.payload.firstName,
        lastName: action.payload.lastName
      };
    default:
      return state;
  }
};

export default userReducer;

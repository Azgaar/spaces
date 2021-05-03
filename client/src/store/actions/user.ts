import {AUTH_USER, UNAUTH_USER, UPDATE_USER} from './types';
import {UserData} from '../../types';

const login = (userData: UserData) => {
  return {type: AUTH_USER, payload: userData};
};

const logout = () => {
  return {type: UNAUTH_USER};
};

const updateUserData = (userData: UserData) => {
  return {type: UPDATE_USER, payload: userData};
};

export const actions = {login, logout, updateUserData};

import {AUTH_USER, UNAUTH_USER, UPDATE_USER} from './types';
import {UserData} from '../../types';

const login = (userData: UserData): {type: string; payload: UserData} => {
  return {type: AUTH_USER, payload: userData};
};

const logout = (): {type: string} => {
  return {type: UNAUTH_USER};
};

const updateUserData = (userData: UserData): {type: string; payload: UserData} => {
  return {type: UPDATE_USER, payload: userData};
};

export const actions = {login, logout, updateUserData};

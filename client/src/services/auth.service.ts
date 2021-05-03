import axios, {AxiosPromise} from 'axios';
import {SignInForm} from '../types';

const signin = (formData: SignInForm): AxiosPromise => axios.post('/login', formData);
const logout = (): AxiosPromise => axios.post('/logout');

export const AuthService = {signin, logout};

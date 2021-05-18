import axios, {AxiosPromise} from 'axios';
import {ForgotPasswordForm, SignInForm} from '../types';

const signin = (formData: SignInForm): AxiosPromise => axios.post('/login', formData);
const logout = (): AxiosPromise => axios.post('/logout');
const checkin = (): AxiosPromise => axios.post('/checkin');
const resetPassword = (formData: ForgotPasswordForm): AxiosPromise => axios.post('/forgotPassword', formData);

export const AuthService = {signin, logout, checkin, resetPassword};

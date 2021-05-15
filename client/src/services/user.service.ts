import axios, {AxiosPromise} from 'axios';
import {UserUpdateForm, SignUpForm} from '../types';

// const signup = (formData: SignUpForm): AxiosPromise => axios.post('/register', formData);
// const fetch = (): AxiosPromise => axios.post('/checkin');
// const update = (formData: ProfileEditForm): AxiosPromise => axios.post('/updateUser', formData);
// const changePassword = (formData: PassportChangeForm): AxiosPromise => axios.post('/changePassword', formData);
// const resetPassword = (formData: ForgotPasswordForm): AxiosPromise => axios.post('/forgotPassword', formData);
// const list = (): AxiosPromise => axios.post('/getUsers');
// const remove = (selection: GridRowId[]): AxiosPromise => axios.delete('/deleteUsers', {data: selection});
// const changeRole = (email: string, role: UserRole): AxiosPromise => axios.post('/changeRole', {email, role});

const getUsers = (): AxiosPromise => axios.get('/users');
const registerUser = (formData: SignUpForm): AxiosPromise => axios.post('/users', formData);
const updateUser = (id: string, formData: UserUpdateForm): AxiosPromise => axios.patch('/users/' + id, formData);
const deleteUser = (id: string): AxiosPromise => axios.delete('/users/' + id);

export const UserService = {getUsers, registerUser, updateUser, deleteUser};

import axios, {AxiosPromise} from 'axios';
import {UserUpdateForm, SignUpForm} from '../types';

const getUsers = (): AxiosPromise => axios.get('/users');
const registerUser = (formData: SignUpForm): AxiosPromise => axios.post('/users', formData);
const updateUser = (id: string, formData: Partial<UserUpdateForm>): AxiosPromise => axios.patch('/users/' + id, formData);
const deleteUser = (id: string): AxiosPromise => axios.delete('/users/' + id);

export const UserService = {getUsers, registerUser, updateUser, deleteUser};

import * as yup from 'yup';
import {PASSWORD_MIN_LENGTH} from '../config';

export const signUpValidationSchema = yup.object({
  firstName: yup.string().trim().required('First name is required').max(80, 'First name must not exceed 80 characters'),
  lastName: yup.string().trim().required('Last name is required').max(100, 'Last name must not exceed 100 characters'),
  email: yup.string().trim().lowercase().required('Email is required').email('Enter a valid email'),
  password: yup.string().trim().required('Password is required').min(PASSWORD_MIN_LENGTH, `Password should be of minimum ${PASSWORD_MIN_LENGTH} characters length`),
  passwordRepeat: yup
    .string()
    .trim()
    .required('Password confirmation is required')
    .oneOf([yup.ref('password'), null], 'Passwords must match'),
  acceptTerms: yup.boolean().required().oneOf([true], 'Please read and accept the tems of use and privacy policy')
});

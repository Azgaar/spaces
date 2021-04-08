import {PASSWORD_MIN_LENGTH} from "../config";

const emailRegEx = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i;
const required = true;

const firstName = {required, maxLength: 80};
const lastName = {required, maxLength: 100};
const email = {required, pattern: {value: emailRegEx, message: "Email format is not valid"}};
const password = {required, minLength: {value: PASSWORD_MIN_LENGTH, message: `Password must have at least ${PASSWORD_MIN_LENGTH} characters`}};
const repeat = "The passwords do not match";
const terms = {required: "Please read and accept terms"};

export const rules = {firstName, lastName, email, password, repeat, terms};

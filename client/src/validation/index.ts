import {PASSWORD_MIN_LENGTH} from "../config";

const required = true;

const firstName = {required, maxLength: 80};
const lastName = {required, maxLength: 100};
const email = {required, pattern: {value: /^\S+@\S+$/i, message: "Email must be valid"}};
const password = {required, minLength: {value: PASSWORD_MIN_LENGTH, message: `Password must have at least ${PASSWORD_MIN_LENGTH} characters`}};
const repeat = "The passwords do not match";
const terms = {required: "Please read and accept terms"};

export const rules = {firstName, lastName, email, password, repeat, terms};

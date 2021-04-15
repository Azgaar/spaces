import Joi from "@hapi/joi";

export const getMaxDate = () => {
  const date = new Date();
  const month = date.getMonth();
  const year = date.getFullYear();
  const yearEnd = "12-31-" + (month > 10 ? year+1 : year);
  return yearEnd;
}

const id = Joi.string().min(2).max(128).required();
const location = Joi.string().min(2).max(128).required();
const workspace = Joi.string().min(2).max(128).required();
const requester = Joi.string().email().min(6).max(128).lowercase().trim().required();
const from = Joi.date().min("now").max(getMaxDate()).required();
const to = Joi.date().min("now").greater(Joi.ref("from")).max(getMaxDate()).required();

const email = Joi.string().email().min(6).max(128).lowercase().trim().required();
const selection = Joi.array().min(1).items(Joi.string()).required();

const reservationCreationSchema = Joi.object({location, workspace, requester, from, to});
const reservationUpdateSchema = Joi.object({id, location, workspace, requester, from, to});
const reservationUserListSchema = Joi.object({email});
const reservationUserDeleteSchema = Joi.object({email, selection});

export {reservationCreationSchema, reservationUpdateSchema, reservationUserListSchema, reservationUserDeleteSchema};

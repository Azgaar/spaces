import {Request, Response} from "express";
import {User} from "../models/user";
import {UserDocument, UserData} from "../types";
import logger from "../utils/logger";

export const createUser = async (userData: UserData) => {
  const user: UserDocument = await User.create(userData);
  logger.info(`[User] User ${user.id} is created`);
  return user;
};

export const updateUser = async (user: UserDocument, userData: UserData) => {
  console.log(user);
  user.email = userData.email;
  user.firstName = userData.firstName;
  user.lastName = userData.lastName;
  user.password = userData.password;
  user.role = userData.role;
  console.log(user);
  const updatedUser: UserDocument = await user.save();
  logger.info(`[User] User ${updatedUser.id} is updated`);
  return updatedUser;
};

export const resetPassword = async (user: UserDocument, password: string) => {
  user.password = password;
  await user.save();
};

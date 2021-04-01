import {Request, Response} from "express";
import {User} from "../models/user";
import {UserDocument, UserData} from "../types";
import logger from "../utils/logger";

export const createUser = async (userData: UserData) => {
  const user: UserDocument = await User.create(userData);
  logger.info(`[User] User ${user.id} is created`);
  return user;
};

export const updateUser = async (user: UserDocument, userData: Partial<UserData>) => {
  Object.assign(user, userData);
  const updatedUser: UserDocument = await user.save();
  logger.info(`[User] User ${updatedUser.id} is updated`);
  return updatedUser;
};

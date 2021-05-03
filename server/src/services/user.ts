import {DeleteWriteOpResultObject} from 'mongodb';
import {User} from '../models/user';
import {UserDocument, UserData} from '../types';
import logger from '../utils/logger';

export const createUser = async (userData: UserData): Promise<UserDocument> => {
  const user: UserDocument = await User.create(userData);
  logger.info(`[User] User ${user.id} is created`);
  return user;
};

export const updateUser = async (user: UserDocument, userData: Partial<UserData>): Promise<UserDocument> => {
  Object.assign(user, userData);
  const updatedUser: UserDocument = await user.save();
  logger.info(`[User] User ${updatedUser.id} is updated`);
  return updatedUser;
};

export const deleteUsers = async (emails: Array<string>): Promise<DeleteWriteOpResultObject['result']> => {
  const deletedUsers = await User.deleteMany({email: {$in: emails}});
  logger.info(`[User] User deletion request: ${emails.join(', ')}`);
  return deletedUsers;
};

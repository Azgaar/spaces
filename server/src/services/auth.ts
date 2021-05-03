import {Request, Response} from 'express';
import config from '../config';
import {UserRole} from '../types';
import logger from '../utils/logger';

export const getUserId = (req: Request): string | undefined => req.session?.userId;
export const getUserRole = (req: Request): UserRole | undefined => req.session?.userRole;
export const getUserEmail = (req: Request): string | undefined => req.session?.userEmail;
export const isLoggedIn = (req: Request): boolean => Boolean(req.session?.userId);

export const logIn = (req: Request, userId: string, userEmail: string, userRole: UserRole): void => {
  req.session.userId = userId;
  req.session.userEmail = userEmail;
  req.session.userRole = userRole;
  req.session.createdAt = new Date();
  logger.info(`[Auth] User ${userId} is logged in`);
};

export const logOut = (req: Request, res: Response): Promise<true | Error> =>
  new Promise((resolve, reject) => {
    req.session.destroy((err: Error) => {
      if (err) {
        reject(err);
      }
      res.clearCookie(config.session.name);
      logger.info('[Auth] User is logged out');
      resolve(true);
    });
  });

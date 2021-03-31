import {Request, Response} from "express";
import config from "../config";
import logger from "../utils/logger";

export const isLoggedIn = (req: Request) => !!req.session!.userId;

export const getUserId = (req: Request) => req.session?.userId;

export const logIn = (req: Request, userId: string) => {
  req.session!.userId = userId;
  req.session!.createdAt = new Date();
  logger.info(`[Auth] User ${userId} is logged in`);
};

export const logOut = (req: Request, res: Response) => new Promise((resolve, reject) => {
  req.session!.destroy((err: Error) => {
    if (err) reject(err);
    res.clearCookie(config.session.name);
    logger.info("[Auth] User is logged out");
    resolve(true);
  });
});

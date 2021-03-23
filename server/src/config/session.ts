import {MongoDBStore} from "connect-mongodb-session";

export const getSessionConfig = () => {
  const name: string = process.env.SESSION_NAME || "sid";
  const resave: boolean = false;
  const saveUninitialized: boolean = false;
  const secret: string = process.env.SESSION_SECRET || "21F463B8C3489";

  const maxAge: number = Number(process.env.SESSION_LIFETIME) || 1000 * 60 * 60 * 2; // two hours
  const sameSite: boolean = true;
  const httpOnly: boolean = true;
  const secure: boolean = process.env.NODE_ENV === "production";

  return {name, resave, saveUninitialized, secret, cookie: {maxAge, sameSite, httpOnly, secure}};
}

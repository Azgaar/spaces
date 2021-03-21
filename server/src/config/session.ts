export const getSessionConfig = () => {
  const name: string = process.env.SESSION_NAME || "sid";
  const resafe = false;
  const saveUninitialized = false;
  const secret: string = process.env.SESSION_SECRET || "21F463B8C3489";

  const maxAge: number = Number(process.env.SESSION_LIFETIME) || 1000 * 60 * 60 * 8;
  const sameSite: boolean = true;
  const secure: boolean = process.env.NODE_ENV === "production";
  const cookie = {maxAge, sameSite, secure};

  return {name, resafe, saveUninitialized, secret, cookie};
}

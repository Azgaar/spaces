type SessionConfig = {
  name: string;
  resave: boolean;
  saveUninitialized: boolean;
  secret: string;
  cookie: {
    maxAge: number;
    sameSite: boolean | 'none' | 'lax' | 'strict' | undefined;
    httpOnly: boolean;
    secure: boolean;
  };
};

export const getSessionConfig = (): SessionConfig => {
  const name = process.env.SESSION_NAME || 'sid';
  const resave = false;
  const saveUninitialized = false;
  const secret = process.env.SESSION_SECRET || '21F463B8C3489';

  const maxAge = Number(process.env.SESSION_LIFETIME) || 1000 * 60 * 60 * 2; // two hours
  const sameSite = 'none';
  const httpOnly = true;
  const secure = process.env.NODE_ENV === 'production';

  return {name, resave, saveUninitialized, secret, cookie: {maxAge, sameSite, httpOnly, secure}};
};

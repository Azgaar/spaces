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
    domain: string | undefined;
  };
};

export const getSessionConfig = (): SessionConfig => {
  const PROD = process.env.NODE_ENV === 'production';

  const name = process.env.SESSION_NAME || 'sid';
  const resave = false;
  const saveUninitialized = false;
  const secret = process.env.SESSION_SECRET || '21F463B8C3489';

  const maxAge = Number(process.env.SESSION_LIFETIME) || 1000 * 60 * 60 * 2; // two hours
  const sameSite = PROD ? 'none' : true;
  const domain = process.env.CLIENT ? new URL(process.env.CLIENT).hostname : '';
  const httpOnly = true;
  const secure = PROD;

  return {name, resave, saveUninitialized, secret, cookie: {maxAge, sameSite, httpOnly, secure, domain}};
};

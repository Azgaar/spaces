type SessionConfig = {
  name: string;
  resave: boolean;
  saveUninitialized: boolean;
  secret: string;
  cookie: {
    maxAge: number;
    sameSite: SameSite;
    httpOnly: boolean;
    secure: boolean;
    domain: string;
  };
};
type SameSite = boolean | 'lax' | 'strict' | 'none' | undefined;

export const getSessionConfig = (): SessionConfig => {
  const name = process.env.SESSION_NAME || 'sid';
  const secret = process.env.SESSION_SECRET || 'ver#$ijnwtrwFEF5%$eRkmgd';
  const resave = false;
  const saveUninitialized = false;

  const maxAge = Number(process.env.SESSION_LIFETIME) || 1000 * 60 * 60 * 8; // 8 hours;
  const sameSite = (process.env.COOKIE_SAME_SITE as SameSite) || true;
  const httpOnly = Boolean(process.env.COOKIE_HTTP_ONLY) || true;
  const secure = Boolean(process.env.COOKIE_SECURE) || false;
  const domain = String(process.env.CLIENT);

  return {name, resave, saveUninitialized, secret, cookie: {maxAge, sameSite, httpOnly, secure, domain}};
};

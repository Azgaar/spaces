type ApiErrorOptions = {
  obfuscate?: boolean;
  stack?: string;
};

export default class ApiError extends Error {
  public statusCode: number;
  public message: string;
  public obfuscate: boolean;
  public stack: string;

  constructor(statusCode: number, message: string, options?: ApiErrorOptions) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.obfuscate = options?.obfuscate || false;
    this.stack = options?.stack || '';

    if (!options?.stack) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

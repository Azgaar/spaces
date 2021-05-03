export default class ApiError extends Error {
  public statusCode: number;
  public message: string;
  public isOperational: boolean;
  public stack: string;

  constructor(statusCode: number, message: string, isOperational = false, stack = '') {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.isOperational = isOperational;
    this.stack = stack;
    if (!stack) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

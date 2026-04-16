class AppError extends Error {
  constructor(message, statusCode) {
    super(message);           // sets this.message
    this.statusCode = statusCode;
    this.isOperational = true; // marks it as a known, expected error
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
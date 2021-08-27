class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    // to send message to the cient only when operational errors
    this.isOperational = true;
    // deal with stackTrace
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError

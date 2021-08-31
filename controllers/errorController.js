const AppError = require("../utils/appError")

const handleCastErrorDB = err => {
  // to handle error from mongoose
  const message = `Invalide ${err.path}: ${err.value}`
  return new AppError(message, 400)
}

const handleDuplicateFieldsDB = err => {
  const value = err.errmsg.match(/(["'])(?:\\.|[^\\])*?\1/)[0];
  console.log(value)
  const message = `Duplicate field value ${value}. Please use an other value`
  return new AppError(message, 400)
}

const handleValidationErrorDB = err => {
  const errors = Object.values(err.errors).map(el => el.message )
  const message =`Invalid input data. ${errors.join('. ')}`
  return new AppError(message, 400)
}

const handleJwtErrorDB = () => new AppError( 'Invalid token. Please log again', 401)

const handleTokenExpiredErrorDB = () => new AppError('Token expired. Please log again', 401)

const sendErrorDev = (err,res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  });
}

sendErrorProd = (err,res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });

    // programing or unknown error
  } else {
    // let's console.log this
    console.error('ERROR... ', err);
    // generic message to the client
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong'
    })
  }
}

module.exports = (err, req, res, next) => {
  // consoleLog.(err.stack);

  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err,res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    if (error.name === 'CastError') error = handleCastErrorDB(error)
    if (error.code === E11000 ) error = handleDuplicateFieldsDB(error)
    if (error.name === 'ValdationError') error = handleValidationErrorDB(error)
    if (error.name === 'JsonwebTokenError') error = handleJwtErrorDB()
    if (error.name === 'TokenExpiredError') error = handleTokenExpiredErrorDB()

    sendErrorProd(error,res);
  }
};

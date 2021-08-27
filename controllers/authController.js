const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');
const User = require('./../models/User')
const catchAsync = require('./../utils/catchAsync')

const signToken = id => {
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
}
// db operations, needs a promise
exports.signup = catchAsync(async (req, res, next) => {
  // await to return value
  // not req.body to prevent to change the body and put role: admin for example...
  const newUser = await User.create({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm
  });

  const token = signToken(newUser._id);

  res.status(201).json({
    status: 'Succes',
    token,
    data: {
      user: newUser
    }
  })
})

// lecture in logging
exports.login = catchAsync(
  async (req, res, next) => {
    const { email, password } = req.body;
    // email password exist ?
    if (!email || !password) {
      // return before next to make sur the code before stopped while launching the promise
      return next(new AppError(`Please provide email and password `, 400))
    }
    // user exist ? select +password to permit show (from model)
    const user = await User.findOne({ email: email }).select('+password');
    // method to compare password ine the model, asynchronous so await
    if (!user || !(await user.correctPassword(password, user.password))) {
      return next(new AppError(' Incorrect email or password', 401))
    }

    // send token
    const token = signToken(user._id)
    res.status(200).json({
      status: 'success',
      token
    })
  }
)


exports.protect = catchAsync(async(req, res, next) => {
  // get the token , http header req.headers Authorisation Bearer
  // ES6 variables declare in scope, only available in scope
  let token;
  if(req.headers.authorization && req.headers.authorization.startWith('Bearer')) {
  token = req.headers.authorization.split(' ')[1];
  }
  // verification token
  if (!token) {
    return next(new AppError('You are not logged in, please login', 401))
  }
  // check if user still exist

  // check if user change assword after jwt was issued

  next()
});

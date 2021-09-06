const crypto = require('crypto')
const AppError = require('../utils/appError');
const { promisify } = require('util')
const jwt = require('jsonwebtoken');
const User = require('./../models/User')
const catchAsync = require('./../utils/catchAsync')
const sendEmail = require('./../utils/email')

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
}

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    // convert in ms
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
    // only https, but works only in production, so handled in the if
    // secure: true,
    // impossible to modify cookie in the browser
    httpOnly: true
  }

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  // store in cookie
  res.cookie('jwt', token, cookieOptions );

    // remove the password from the output
  user.password = undefined
  res.status(statusCode).json({
    status: 'Success',
    token,
    data: {
      user
    }
  });
};


// db operations, needs a promise
exports.signup = catchAsync(async (req, res, next) => {
  // await to return value
  // not req.body to prevent to change the body and put role: admin for example...
  const newUser = await User.create({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,

  });
  createSendToken(newUser, 201, res)
})


exports.login = catchAsync(async (req, res, next) => {
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
    createSendToken(user, 200, res)
  }
);


exports.protect = catchAsync(async(req, res, next) => {
  // get the token , http header req.headers Authorisation Bearer
  // ES6 variables declare in scope, only available in scope
  let token;
  if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
  token = req.headers.authorization.split(' ')[1];
  }
  // verification token
  if (!token) {
    return next(new AppError('You are not logged in, please login', 401))
  }
  // check if user still exist
  const decoded = await promisify (jwt.verify)(token, process.env.JWT_SECRET);
  const currentUser = await User.findById(decoded.id);
  if(!currentUser) {
    return next(new AppError('The token does no longer exist', 401))
  }
  // check if user change password after jwt was issued
  // .iat = date token expire
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(new AppError('User recently changed password', 401))
  }
  // grant access to protected route
  req.user = currentUser;
  next()
});


// to pass arguments in middlewares routes
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles is an array
    // closure has access to role
    if(!roles.includes(req.user.role)){
    return next(new AppError('you do not have permission for this action', 403));
    }
    next()
  };
};

exports.forgotPassword = catchAsync(async(req, res, next) => {
  // 1 get user based on email
  const user = await User.findOne({ email: req.body.email })
  if (!user) {
    return next(new AppError('user with this email not found', 404))
  }

  //  2 generate token
  const resetToken = user.createPasswordResetToken();
  // need to save this token to compare
  await user.save({validateBeforeSave: false});

  //  3send it to user email
  const resetURL = `${req.protocol}://${req.get('host')}/resetPassword/${resetToken}`;
  const message = `Forgot your password? Submit a PATCH request with your new password ans passwordConfirm to: ${resetURL}.\nIf ypu didn't forget your password, please ignore this email`

    try {
      // sendEmail is async so await
      await sendEmail({
        email: user.email,
        subject: 'Your password reset token valid for 10 min',
        message
      });

      res.status(200).json({
        status: 'success',
        message: 'Token sent to email!'
      })
    } catch(err) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save( { validateBeforeSave: false})

      return next(new AppError('There was an error sending the password'), 500)
    }
});


exports.resetPassword = catchAsync(
  async(req, res, next) => {
  // 1 get user based on token
  // token is a parameter:  router.patch('/resetPassword/:token', so req.params.token
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
// $gt == greater than https://docs.mongodb.com/manual/reference/operator/query-comparison/
  const user = await User.findOne({passwordResetToken: hashedToken, passwordResetExpires: {$gt: Date.now()}});

  // 2 if token has not expired, and if there is a user, set the new password
    if (!user) {
      return next(new AppError('Token is invalid or has expired', 400))
    }
  // 3 update changedPassword
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // 4 Log the user, send the JWT token
    // send token
    createSendToken(user, 200, res)
  }
)

exports.updatePassword = catchAsync(async(req, res, next) => {
  //  1 get user from collection
  const user = await User.findById(req.user._id).select('+password');
  // 2 check if posted password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError('current password is wrong', 40))
  }
  // 3 if so, update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  //  !!! Not USer.findByIdAndUpdate :  validations are not going to work,
  //      and middleware to encrypt passwords wont work
  await user.save();
  // 4 log in user user, send JWT
  const token = signToken(user._id)
  createSendToken(user, 200, res)
  }
)

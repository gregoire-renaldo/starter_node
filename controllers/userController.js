const User = require('../models/User');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

// ...allowFields = array with all arguments
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  // obj == req.body
  // forEach properties of req.body
  Object.keys(obj).forEach(el => {
    if(allowedFields.includes(el)) newObj[el] = obj[el]
  })
  return newObj
}
exports.updateMe = catchAsync(
  async(req, res, next) => {
    // 1) create error id user post password
    if (req.body.password || req.body.passwordConfirm) {
      return next(new AppError('route not for password upddate', 400 ))
    }

    // 2 update user, close the door to change role etc.. add the field
    const filteredBody = filterObj(req.body, 'firstname', 'lastname', 'email')
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {new: true, runValidators: true} )

    res.status(200).json({
      status: 'success',
      data: {
        user: updatedUser
      }
    })
  }
)

exports.getAllUsers = catchAsync(async (req, res, next ) => {
  const users = await User.find()
  // send response
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users
    }
  })
})

// de-activate accont account instead of deleting
exports.deleteMe = catchAsync(async(req,res,next) => {
  const user = await User.findByIdAndUpdate(req.user.id, { active: false })

  res.status(204).json({
    status: 'success',
    data : null
  })
})


exports.deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id)
  if (!user) {
    return next(new AppError('No user found with that ID', 404))
  }
  res.status(204).json({
    status: 'success',
    data: {
      user
    }
  })
})

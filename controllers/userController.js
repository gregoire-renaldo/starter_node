const User = require('../models/User')
const catchAsync = require('../utils/catchAsync');

exports.getAllUsers = catchAsync(async (req,res,nex ) => {
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

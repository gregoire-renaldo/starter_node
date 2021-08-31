const Boat = require('../models/Boat')
const AppError = require('../utils/appError')
const catchAsync = require('../utils/catchAsync')

exports.getBoat = catchAsync(async(req,res,next) => {
  const boat = await Boat.findById(req.params.id)
  // Boat.findOne({ _id: req.params.id})
  if (!boat) {
    return next(new AppError('No boat found with that ID', 404))
  }
  res.status(200).json({
    status: 'success',
    data: {
      boat
    }
  })
})

exports.createBoat = catchAsync(async(req,res,next) => {
  const newBoat = await Boat.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      boat: newBoat
    }
  })
})

exports.updateBoat = catchAsync(async( req,res,next) => {
  const boat = Boat.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  })

  if (!boat) {
    return next(new AppError('No boat found with that ID', 404))
  }

  res.status(200).json({
    status: 'success',
    data: {
      boat
    }
  });
});


exports.deleteBoat = catchAsync(async(req,res,next) => {
  const boat = await Boat.findByIdAndDelete(req.params.id)

  if (!boat) {
    return next(new AppError('No boat found with that ID', 404))
  }

  res.status(204).json({
    status: 'success',
    data: {
      boat
    }
  })
})

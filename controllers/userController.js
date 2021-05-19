// eslint-disable-next-line prefer-destructuring
const User = require('../models').User;

// const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getAllUsers = catchAsync(async (req, res) => {
  const doc = await User.findAll();
  if (!doc)
    return res.status(404).json({
      status: 'fail',
    });
  res.status(200).json({
    status: 'success',
    results: doc.length,
    data: {
      doc,
    },
  });
});

exports.updateUser = catchAsync(async (req, res) => {
  const { id } = req.params;
  const doc = await User.update(req.body, {
    where: {
      id: id,
    },
  });
  if (!doc) {
    res.status(404).json({
      status: 'fail',
      message: 'No User found with that id!!',
    });
  }
  const updatedUser = await User.findOne({
    where: {
      id: id,
    },
  });
  res.status(200).json({
    status: 'success',
    data: {
      data: updatedUser,
    },
  });
});

exports.getOneUser = catchAsync(async (req, res) => {
  const { id } = req.params;
  const doc = await User.findOne({
    where: {
      id: id,
    },
  });
  console.log(doc);

  if (!doc) {
    res.status(404).json({
      status: 'fail',
      message: 'No User found with that id!!',
    });
  }
  res.status(200).json({
    status: 'success',
    data: {
      data: doc,
    },
  });
});

exports.deleteOneUser = catchAsync(async (req, res) => {
  const { id } = req.params;
  const doc = await User.destroy({
    where: {
      id: id,
    },
  });
  if (!doc) {
    res.status(204).json({
      status: 'fail',
      message: 'No User found with that id!!',
    });
  }

  res.status(404).json({
    status: 'success',
    message: 'User has been deleted successfully.',
  });
});

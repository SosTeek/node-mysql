const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
// eslint-disable-next-line prefer-destructuring
const User = require('../models').User;

// const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const signToken = (id) =>
  jwt.sign({ id }, `this-is-secret-key`, {
    expiresIn: `90d`,
  });

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user.id);
  const cookieOptions = {
    expires: new Date(Date.now() + `90d` * 24 * 60 * 60 * 1000),
    // httpOnly: true,
    // secure: true,
  };
  res.cookie('jwt', token, cookieOptions);
  //remove password form output
  user.password = undefined;
  user.confirmPassword = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

exports.signUp = catchAsync(async (req, res, next) => {
  const doc = await User.findOne({
    where: {
      email: req.body.email,
    },
  });
  if (doc)
    return res.status(400).json({
      status: 'fail',
      message: 'Email is already in use',
    });
  if (req.body.password === req.body.confirmPassword) {
    const newUser = await User.create({
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 12),
      confirmPassword: req.body.confirmPassword,
    });

    createSendToken(newUser, 201, res);
  } else {
    res.status(400).json({
      message: `Password doesn't match!!`,
    });
  }
});

exports.logIn = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  const { password } = req.body;
  //Check if the Email and Password Exists
  if (!email || !password) {
    return res.status(400).json({
      status: 'fail',
      message: 'Please provide email and Password!!!',
    });
  }

  // check if the user exists and password is correct
  const user = await User.findOne({
    where: {
      email: req.body.email,
      // password: bcrypt.compareSync(req.body.password, password),
    },
  });
  if (!user) {
    return res.status(404).json({
      status: 'fail',
      message: 'Email nmot found',
    });
  }

  const isValidPassword = bcrypt.compareSync(req.body.password, user.password);
  if (!isValidPassword) {
    return res.status(401).send({
      status: 'fail',
      message: 'Invalid Password!',
    });
  }

  createSendToken(user, 200, res);
});

exports.logOut = catchAsync(async (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() * 10 * 1000),
    httpOnly: true,
    secure: false,
  });
  res.status(200).json({ status: 'success' });
});

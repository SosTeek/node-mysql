const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { promisify } = require('util');
// const AppError = require('../utils/appError');
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
  if (req.body.password.length >= 8) {
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
  } else {
    res.status(400).json({
      message: `At least 8 characters required!!`,
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
      message: 'Email not found',
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

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check of it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  if (!token || token === 'null') {
    return next(
      res.status(400).json({
        status: 'fail',
        message: 'You are not logged in! Please log in to get access.',
      })
    );
  }
  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, `this-is-secret-key`);
  // 3) Check if user still exists
  const currentUser = await User.findByPk(decoded.id);
  if (!currentUser) {
    return next(
      res.status(400).json({
        status: 'fail',
        message: 'The user belonging to this token does no longer exist.',
      })
    );
  }

  // // 4) Check if user changed password after the token was issued
  // if (currentUser.changedPasswordAfter(decoded.iat)) {
  //   return next(
  //     new AppError('User recently changed password! Please log in again.', 401)
  //   );
  // }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  res.locals.user = currentUser;
  next();
});

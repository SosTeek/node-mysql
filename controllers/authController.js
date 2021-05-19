const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { Op } = require('sequelize');
const { promisify } = require('util');
// const AppError = require('../utils/appError');
// eslint-disable-next-line prefer-destructuring
const User = require('../models').User;

// const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const sendEmail = require('../utils/email');

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
  // console.log(res.cookie('jwt', token, cookieOptions));
  //remove password form output
  user.password = undefined;
  user.confirmPassword = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    user,
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
        role: req.body.role,
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
    // console.log(token);
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

exports.restrictTo = (...roles) => (req, res, next) => {
  // roles ['admin']. role='user'
  if (!roles.includes(req.user.role)) {
    // console.log('k chha');
    return next(
      res.status(403).json({
        status: 'fail',
        message: 'You donot have permission to perform this action.',
      })
    );
  }
  return next();
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  //Get a user based on POSTed email address
  const user = await User.findOne({
    where: {
      email: req.body.email,
    },
  });
  if (!user) {
    return next(
      res.status(404).json({
        status: 'fail',
        message: 'Cannot find the user with that email id!!!',
      })
    );
  }
  // console.log(user);
  //Generate random reset tokens
  const resetToken = user.createPasswordResetToken();
  await user.save({ validate: false });

  //Send it to email address

  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/user/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;
  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 min)',
      message,
    });
    // await new Email(user, resetURL).sendPasswordReset();

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!',
    });
  } catch (err) {
    console.log(err);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      res.status(500).json({
        status: 'fail',
        message: 'There was an error sending the email. Try again later!',
      })
    );
  }
});
exports.resetPassword = async (req, res, next) => {
  // Get User based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    where: {
      passwordResetToken: hashedToken,
      passwordResetExpires: {
        [Op.gt]: Date.now(),
      },
    },
  });

  // If the token is not expired and there is user, set the new password
  if (!user) {
    return next(
      res.status(400).json({
        message: 'Token is invalid or has expired',
      })
    );
  }
  // user.password = req.body.password;
  // user.confirmPassword = req.body.confirmPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();
  // Log the user in, Send JWT
  createSendToken(user, 200, res);
};

exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1) Get user from collection
  // const user = await User.findByPk(req.user.id).select('+password');
  const user = await User.findByPk(req.user.id);

  // 2) Check if POSTed current password is correct

  if (req.body.password.length >= 8) {
    if (req.body.password === req.body.passwordConfirm) {
      // 3) If so, update password

      user.password = await bcrypt.hashSync(req.body.password, 12);
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      user.passwordChangedAt = undefined;

      await user.save();

      console.log(user);
      // User.findByIdAndUpdate will NOT work as intended!
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

  // 4) Log user in, send JWT
  createSendToken(user, 200, res);
});

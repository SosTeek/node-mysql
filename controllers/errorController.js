// const AppError = require('../utils/appError');

// UniqueConstraintsError
// ValidationError
const dotenv = require('dotenv');

dotenv.config({ path: '../app.js' });

const sendErrorDev = (err, req, res) => {
  // API
  if (req.originalUrl.startsWith('/api')) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      const mes = 'Email is already in use!! Use another Email';
      return res.status(err.statusCode).json({
        status: err.status,
        message: mes,
        name: err.name,
        stack: err.stack,
      });
    }
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  sendErrorDev(err, req, res);
  // if (process.env.NODE_ENV === 'development') {
  //   console.log(process.env.NODE_ENV);
  //   sendErrorDev(err, req, res);
  // }
};

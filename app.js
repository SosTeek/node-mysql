const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const globalErrorHandler = require('./controllers/errorController');

const indexRouter = require('./routes/index');
const customerRouter = require('./routes/customerRoutes');
const productRouter = require('./routes/productRoutes');
const brandRouter = require('./routes/brandRoutes');
const categoryRouter = require('./routes/categoryRoutes');
const userRouter = require('./routes/userRoutes');
const orderRouter = require('./routes/orderRoutes');

const app = express();

// Serving static file
app.use(express.static(path.join(__dirname, 'public')));

// login
app.use(logger('dev'));

// Body parser, reading data from body into req.body
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());
app.use(express.json());

app.use('/', indexRouter);
app.use('/api/customer', customerRouter);
app.use('/api/product', productRouter);
app.use('/api/brand', brandRouter);
app.use('/api/category', categoryRouter);
app.use('/api/user', userRouter);
app.use('/api/order', orderRouter);

app.use(globalErrorHandler);

module.exports = app;

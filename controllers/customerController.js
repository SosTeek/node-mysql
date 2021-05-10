// eslint-disable-next-line prefer-destructuring
const Customer = require('../models').Customer;

const catchAsync = require('../utils/catchAsync');

exports.createCustomer = catchAsync(async (req, res) => {
  const newCustomer = await Customer.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      newCustomer,
    },
  });
});

exports.getAllCustomers = catchAsync(async (req, res) => {
  const doc = await Customer.findAll();
  res.status(200).json({
    status: 'success',
    results: doc.length,
    data: {
      doc,
    },
  });
});

exports.findOneCustomer = catchAsync(async (req, res) => {
  const { id } = req.params;
  const doc = await Customer.findOne({
    where: {
      id: id,
    },
  });
  if (!doc) {
    res.status(404).json({
      status: 'fail',
      message: 'No Customer found with that id!!',
    });
  }
  res.status(200).json({
    status: 'success',
    data: {
      data: doc,
    },
  });
});

exports.updateOneCustomer = catchAsync(async (req, res) => {
  const { id } = req.params;
  const doc = await Customer.update(req.body, {
    where: {
      id: id,
    },
  });
  if (!doc) {
    res.status(404).json({
      status: 'fail',
      message: 'No Customer found with that id!!',
    });
  }
  const updatedCustomer = await Customer.findOne({
    where: {
      id: id,
    },
  });
  res.status(200).json({
    status: 'success',
    data: {
      data: updatedCustomer,
    },
  });
});

exports.deleteOneCustomer = catchAsync(async (req, res) => {
  const { id } = req.params;
  const doc = await Customer.destroy({
    where: {
      id: id,
    },
  });
  if (!doc) {
    res.status(204).json({
      status: 'fail',
      message: 'No Customer found with that id!!',
    });
  }

  res.status(404).json({
    status: 'success',
    message: 'Customer has been deleted successfully.',
  });
});

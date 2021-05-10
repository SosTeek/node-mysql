// eslint-disable-next-line prefer-destructuring
const Product = require('../models').Product;

const catchAsync = require('../utils/catchAsync');

exports.createProduct = catchAsync(async (req, res) => {
  const newProduct = await Product.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      newProduct,
    },
  });
});

exports.getAllProducts = catchAsync(async (req, res) => {
  const doc = await Product.findAll();
  res.status(200).json({
    status: 'success',
    results: doc.length,
    data: {
      doc,
    },
  });
});

exports.findOneProduct = catchAsync(async (req, res) => {
  const { id } = req.params;
  const doc = await Product.findOne({
    where: {
      id: id,
    },
    include: ['brand', 'category'],
    // include: 'category',
  });
  if (!doc) {
    res.status(404).json({
      status: 'fail',
      message: 'No product found with that id!!',
    });
  }
  res.status(200).json({
    status: 'success',
    data: {
      data: doc,
    },
  });
});

exports.updateOneProduct = catchAsync(async (req, res) => {
  const { id } = req.params;
  const doc = await Product.update(req.body, {
    where: {
      id: id,
    },
  });
  if (!doc) {
    res.status(404).json({
      status: 'fail',
      message: 'No product found with that id!!',
    });
  }
  const updatedDoc = await Product.findOne({
    where: {
      id: id,
    },
  });
  res.status(200).json({
    status: 'success',
    data: {
      data: updatedDoc,
    },
  });
});

exports.deleteOneProduct = catchAsync(async (req, res) => {
  const { id } = req.params;
  const doc = await Product.destroy({
    where: {
      id: id,
    },
  });
  if (!doc) {
    res.status(404).json({
      status: 'fail',
      message: 'No product found with that id!!',
    });
  }

  res.status(404).json({
    status: 'success',
    message: 'User has been deleted successfully.',
  });
});

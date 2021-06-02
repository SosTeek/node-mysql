const catchAsync = require('express-async-handler');
const SearchBuilder = require('sequelize-search-builder');
const models = require('../models');
// const { Op } = require('sequelize');
// eslint-disable-next-line prefer-destructuring
const Product = require('../models').Product;
// eslint-disable-next-line prefer-destructuring
const Category = require('../models').Category;
// eslint-disable-next-line prefer-destructuring
const Brand = require('../models').Brand;

// const catchAsync = require('../utils/catchAsync');
// const ApiFeatures = require('../utils/apiFeatures');

exports.createProduct = catchAsync(async (req, res) => {
  const validCategory = await Category.findOne({
    where: { id: req.body.categoryId },
  });
  if (!validCategory) {
    return res.status(400).json({
      status: 'fail',
      message: 'Please provide a valid categoryId!!',
    });
  }
  const validBrand = await Brand.findOne({
    where: { id: req.body.brandId },
  });

  if (!validBrand) {
    return res.status(400).json({
      status: 'fail',
      message: 'Please provide a valid brandId!!',
    });
  }

  const newProduct = await Product.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      newProduct,
    },
  });
});

// With Filtering, Sorting and Paginations
exports.getAllProducts = catchAsync(async (req, res) => {
  const { sort, page } = req.query;
  const paramQuerySQl = {};
  let { limit } = req.query;
  let offset;

  // filtering
  const search = new SearchBuilder(models.Sequelize, req.query);
  const whereQuery = search.getWhereQuery();

  paramQuerySQl.where = whereQuery;
  // if (filter !== '' && typeof filter !== 'undefined') {
  //   const query = filter.split(',').map((item) => ({
  //     [Op.iLike]: `%${item}%`,
  //   }));
  //   console.log(query);
  //   paramQuerySQl.where = {
  //     title: { [Op.or]: query },
  //   };
  // }
  //sorting
  if (sort !== '' && typeof sort !== 'undefined') {
    // let order = [];
    const query = sort.split(',').map((item) => {
      if (item.charAt(0) !== '-') {
        return [item, 'ASC'];
      }
      return [item.replace('-', ''), 'DESC'];
    });
    paramQuerySQl.order = query;
  }
  //paginations
  if (page && limit !== '' && typeof page && limit !== 'undefined') {
    paramQuerySQl.limit = parseInt(limit, 10);
    offset = page * limit - limit;
    paramQuerySQl.offset = offset;
  } else {
    limit = 5;
    offset = 0;
    paramQuerySQl.limit = limit;
    paramQuerySQl.offset = offset;
  }
  console.log(paramQuerySQl);
  const doc = await Product.findAndCountAll(paramQuerySQl);
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

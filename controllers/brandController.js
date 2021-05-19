const multer = require('multer');
const sharp = require('sharp');

// eslint-disable-next-line prefer-destructuring
const Brand = require('../models').Brand;
// eslint-disable-next-line prefer-destructuring
const Category = require('../models').Category;
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadBrandPhoto = upload.single('brandImage');

exports.resizeBrandPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();
  const { brandName } = req.body;

  req.file.filename = `brand-${brandName}-${Date.now()}.jpeg`;
  console.log(req.file.filename);
  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/images/brand/${req.file.filename}`);
  next();
});

exports.createBrand = catchAsync(async (req, res) => {
  const validCategory = await Category.findOne({
    where: { id: req.body.categoryId },
  });
  if (!validCategory) {
    return res.status(400).json({
      status: 'fail',
      message: 'Please provide a valid categoryId!!',
    });
  }
  const newBrand = await Brand.create({
    brandName: req.body.brandName,
    brandImage: req.file.filename,
    brandTagline: req.body.brandTagline,
    categoryId: req.body.categoryId,
  });
  console.log(newBrand.categoryId);
  res.status(201).json({
    status: 'success',
    data: {
      newBrand,
    },
  });
});

exports.getAllBrand = catchAsync(async (req, res) => {
  const doc = await Brand.findAll();
  res.status(200).json({
    status: 'success',
    results: doc.length,
    data: {
      doc,
    },
  });
});

exports.findOneBrand = catchAsync(async (req, res) => {
  const { id } = req.params;
  const doc = await Brand.findOne({
    where: {
      id: id,
    },
    include: ['category', 'products'],
  });
  if (!doc) {
    return res.status(404).json({
      status: 'fail',
      message: 'There is no any Brand with that ID!!',
    });
    // new AppError('There is no any Brand with that ID!!', 404);
  }
  res.status(200).json({
    status: 'success',
    data: {
      data: doc,
    },
  });
});

exports.updateOneBrand = catchAsync(async (req, res) => {
  const { id } = req.params;
  const doc = await Brand.update(req.body, {
    where: {
      id: id,
    },
  });
  if (!doc) {
    return new AppError('There is no any Brand with that ID!!', 404);
  }
  const updatedBrand = await Brand.findOne({
    where: {
      id: id,
    },
  });
  res.status(200).json({
    status: 'success',
    data: {
      data: updatedBrand,
    },
  });
});

exports.deleteOneBrand = catchAsync(async (req, res) => {
  const { id } = req.params;
  const doc = await Brand.destroy({
    where: {
      id: id,
    },
  });
  if (!doc) {
    return new AppError('There is no any Brand with that ID!!', 404);
  }

  res.status(404).json({
    status: 'success',
    message: 'Customer has been deleted successfully.',
  });
});

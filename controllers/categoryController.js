const multer = require('multer');
const sharp = require('sharp');
// eslint-disable-next-line prefer-destructuring
const Category = require('../models').Category;
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  // console.log(file);
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

exports.uploadCategoryPhoto = upload.single('categoryImage');

exports.resizeCategoryPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();
  const { categoryName } = req.body;
  console.log(categoryName);
  req.file.filename = `category-${categoryName}-${Date.now()}.jpeg`;
  console.log(req.file.filename);
  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/images/category/${req.file.filename}`);
  next();
});

exports.createCategory = catchAsync(async (req, res) => {
  const newCategory = await Category.create({
    categoryName: req.body.categoryName,
    categoryImage: req.file.filename,
    categoryDescription: req.body.categoryDescription,
  });
  res.status(201).json({
    status: 'success',
    data: {
      newCategory,
    },
  });
});

exports.getAllCategory = catchAsync(async (req, res) => {
  const doc = await Category.findAll();
  res.status(200).json({
    status: 'success',
    results: doc.length,
    data: {
      doc,
    },
  });
});

exports.findOneCategory = catchAsync(async (req, res) => {
  const { id } = req.params;
  const doc = await Category.findOne({
    where: {
      id: id,
    },
    include: ['brands', 'products'],
  });
  if (!doc) {
    return new AppError('There is no any category with that ID!!', 404);
  }
  res.status(200).json({
    status: 'success',
    data: {
      data: doc,
    },
  });
});

exports.updateOneCategory = catchAsync(async (req, res) => {
  const { id } = req.params;
  const doc = await Category.update({
    where: {
      id: id,
    },
  });
  if (!doc) {
    return new AppError('There is no any category with that ID!!', 404);
  }
  const updatedCategory = await Category.findOne({
    where: {
      id: id,
    },
  });
  res.status(200).json({
    status: 'success',
    data: {
      data: updatedCategory,
    },
  });
});

exports.deleteOneCategory = catchAsync(async (req, res) => {
  const { id } = req.params;
  const doc = await Category.destroy({
    where: {
      id: id,
    },
  });
  if (!doc) {
    return new AppError('There is no any category with that ID!!', 404);
  }

  res.status(404).json({
    status: 'success',
    message: 'Customer has been deleted successfully.',
  });
});

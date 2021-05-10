const express = require('express');
// const multer = require('multer');

// const upload = multer({ dest: 'public/images/category' });

const categoryController = require('../controllers/categoryController');

const router = express.Router();

router.route('/').get(categoryController.getAllCategory).post(
  // upload.single('categoryImage'),
  categoryController.uploadCategoryPhoto,
  categoryController.resizeCategoryPhoto,
  categoryController.createCategory
);

router
  .route('/:id')
  .get(categoryController.findOneCategory)
  .patch(categoryController.updateOneCategory)
  .delete(categoryController.deleteOneCategory);

module.exports = router;

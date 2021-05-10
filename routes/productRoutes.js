const express = require('express');
const productController = require('../controllers/productController');

const router = express.Router();

router
  .route('/')
  .get(productController.getAllProducts)
  .post(productController.createProduct);

router
  .route('/:id')
  .get(productController.findOneProduct)
  .patch(productController.updateOneProduct)
  .delete(productController.deleteOneProduct);

module.exports = router;

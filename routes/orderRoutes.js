const express = require('express');
const authController = require('../controllers/authController');
const orderController = require('../controllers/orderController');

const router = express.Router();

router
  .route('/')
  .get(orderController.findAllOrders)
  .post(authController.protect, orderController.createOrder);

router.route('/:id').get(orderController.findOneOrder);
//   .patch(productController.updateOneProduct)
//   .delete(productController.deleteOneProduct);

module.exports = router;

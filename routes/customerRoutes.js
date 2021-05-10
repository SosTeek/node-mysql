const express = require('express');
const customerController = require('../controllers/customerController');

const router = express.Router();

router
  .route('/')
  .get(customerController.getAllCustomers)
  .post(customerController.createCustomer);

router
  .route('/:id')
  .get(customerController.findOneCustomer)
  .patch(customerController.updateOneCustomer)
  .delete(customerController.deleteOneCustomer);

module.exports = router;

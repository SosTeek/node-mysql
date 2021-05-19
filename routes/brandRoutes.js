const express = require('express');

const brandControler = require('../controllers/brandController');
const authController = require('../controllers/authController');

const router = express.Router();
router.use(authController.protect);
router
  .route('/')
  .get(brandControler.getAllBrand)
  .post(
    authController.restrictTo('admin'),
    brandControler.uploadBrandPhoto,
    brandControler.resizeBrandPhoto,
    brandControler.createBrand
  );

router
  .route('/:id')
  .get(brandControler.findOneBrand)
  .patch(brandControler.updateOneBrand)
  .delete(brandControler.deleteOneBrand);

module.exports = router;

const express = require('express');

const brandControler = require('../controllers/brandController');

const router = express.Router();

router
  .route('/')
  .get(brandControler.getAllBrand)
  .post(
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

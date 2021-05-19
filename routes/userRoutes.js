const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();
router.route('/').get(userController.getAllUsers);

router.route('/signup').post(authController.signUp);
router.route('/login').post(authController.logIn);
router.route('/logout').get(authController.logOut);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

router.use(authController.protect);

router.patch('/updateMyPassword', authController.updatePassword);

router
  .route('/:id')
  .get(userController.getOneUser)
  .patch(userController.updateUser)
  .delete(userController.deleteOneUser);

module.exports = router;

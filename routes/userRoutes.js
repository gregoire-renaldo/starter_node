const express = require('express')
const router = express.Router();

const userController = require('../controllers/userController')
const authController = require('../controllers/authController');

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

// test restricted route with role
router.delete('/deleteUser/:id', authController.protect, authController.restrictTo('admin', 'owner-boat'), userController.deleteUser)


module.exports = router

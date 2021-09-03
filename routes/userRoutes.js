const express = require('express')
const router = express.Router();

const userController = require('../controllers/userController')
const authController = require('../controllers/authController');

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

router.patch('/updatePassword', authController.protect, authController.updatePassword)

// test restricted route with role
router.get('/getAllUsers',  userController.getAllUsers)
router.delete('/deleteUser/:id', authController.protect, authController.restrictTo('admin', 'owner-boat'), userController.deleteUser)


// a user can update his info
router.patch('/updateMe', authController.protect, userController.updateMe)

// a user can delete (de-activate) his account
router.delete('/deleteMe', authController.protect, userController.deleteMe)

module.exports = router

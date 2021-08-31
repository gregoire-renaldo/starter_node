const express = require('express')
const router = express.Router();

const authController = require('../controllers/authController');

router.post('/signup', authController.signup);
router.post('/login', authController.login);

// router.post('/signup', userCtrl.signup);
// router.post('/login', userCtrl.login);

module.exports = router

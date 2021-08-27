const express = require('express')
const router = express.Router();
const boatController = require('../controllers/boatController')
const authController = require('../controllers/boatController')


router.post('/createBoat', authController.protect, boatController.createBoat )

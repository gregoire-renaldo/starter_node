const express = require('express')
const router = express.Router();
const boatController = require('../controllers/boatController')
const authController = require('../controllers/boatController')


router.post('/createBoat', authController.protect, boatController.createBoat )
router.patch('/updateBoat', authController.protect, boatController.updateBoat )
router.delete('deleteBoat', authController.protect, boatController.deleteBoat)

router.get('getBoat/:id', authController.protect, boatController.getBoat)

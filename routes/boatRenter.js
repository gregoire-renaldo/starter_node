const express = require("express");
const router = express.Router();
const boatRenterCtrl = require("../controllers/boatRenter.js");

router.get('/boat/renter/index', boatRenterCtrl.all);
router.get('/boat/renter/show/:id', boatRenterCtrl.show);

module.exports = router

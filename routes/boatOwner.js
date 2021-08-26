const express = require("express");
const router = express.Router();
const boatOwnerCtrl = require("../controllers/boatOwner.js");

router.post('/boat/owner/create', boatOwnerCtrl.create);

module.exports = router

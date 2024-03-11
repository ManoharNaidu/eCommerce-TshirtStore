const express = require('express');
const router = express.Router();

// importing all controllers
const {home,homedummy} = require('../controllers/homeController');

// routes
router.route("/").get(home)
router.route("/dummy").get(homedummy)

module.exports = router;
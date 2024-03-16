const express = require('express');
const router = express.Router();
const {isLoggedin, customRole} = require('../middlewares/user');
const { testProduct } = require('../controllers/prodcutController');

router.route('/testProduct').get(testProduct)


module.exports = router;
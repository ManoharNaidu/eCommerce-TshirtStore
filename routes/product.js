const express = require('express');
const router = express.Router();
const { isLoggedIn, customRole } = require('../middlewares/user');
const { addProduct } = require('../controllers/prodcutController');

router.route('/addProduct').post(isLoggedIn,addProduct)


module.exports = router;
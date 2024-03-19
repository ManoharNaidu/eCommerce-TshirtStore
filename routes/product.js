const express = require('express');
const router = express.Router();
const { isLoggedIn, customRole } = require('../middlewares/user');
const { addProduct, getProducts } = require('../controllers/prodcutController');

// user routes
router.route("/products").get(isLoggedIn, getProducts)


// admin routes
router.route("/admin/addProducts").post(isLoggedIn, customRole('admin'), addProduct)


module.exports = router;
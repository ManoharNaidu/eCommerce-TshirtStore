const express = require('express');
const router = express.Router();
const { isLoggedIn, customRole } = require('../middlewares/user');
const { addProduct, getProducts, AdminGetProducts, getOneProduct, updateProduct } = require('../controllers/prodcutController');

// user routes
router.route("/products").get(isLoggedIn, getProducts)
router.route("/product/:id").get(isLoggedIn, getOneProduct)

// admin routes
router.route("/admin/products").get(isLoggedIn, customRole('admin'), AdminGetProducts)
router.route("/admin/addProducts").post(isLoggedIn, customRole('admin'), addProduct)
router.route("/admin/updateProduct/:id").put(isLoggedIn, customRole('admin'), updateProduct)


module.exports = router;
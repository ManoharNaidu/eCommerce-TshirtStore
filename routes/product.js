const express = require('express');
const router = express.Router();
const { isLoggedIn, customRole } = require('../middlewares/user');
const { addProduct, getProducts, AdminGetProducts, getOneProduct, AdminupdateOneProduct, deleteOneProduct } = require('../controllers/prodcutController');

// user routes
router.route("/products").get(isLoggedIn, getProducts)
router.route("/product/:id").get(isLoggedIn, getOneProduct)

// admin routes
router.route("/admin/products").get(isLoggedIn, customRole('admin'), AdminGetProducts)
router.route("/admin/addProduct").post(isLoggedIn, customRole('admin'), addProduct)
router
    .route("/admin/product/:id")
    .put(isLoggedIn, customRole('admin'), AdminupdateOneProduct)
    .delete(isLoggedIn, customRole('admin'), deleteOneProduct)

module.exports = router;
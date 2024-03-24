const express = require('express');
const router = express.Router();
const { isLoggedIn, customRole } = require('../middlewares/user');

const {createOrder, getOrder, getMyOrders, adminGetAllOrders, adminGetOneOrder, adminUpdateOrder, adminDeleteOneOrder} = require('../controllers/orderController');

router.route("/order/create").post(isLoggedIn, createOrder)
router.route("/order/:id").get(isLoggedIn, getOrder)
router.route("/myOrders").get(isLoggedIn, getMyOrders)

// admin routes
router.route("/admin/orders").get(isLoggedIn, customRole("admin"), adminGetAllOrders)
router.route("/admin/order/:id").get(isLoggedIn, customRole("admin"), adminGetOneOrder)
router.route("/admin/order/:id").put(isLoggedIn, customRole("admin"), adminUpdateOrder)
router.route("/admin/order/:id").delete(isLoggedIn, customRole("admin"), adminDeleteOneOrder)


module.exports = router;
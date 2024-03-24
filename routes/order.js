const express = require('express');
const router = express.Router();
const { isLoggedIn, customRole } = require('../middlewares/user');

const {createOrder, getOrder, getMyOrders} = require('../controllers/orderController');

router.route("/order/create").post(isLoggedIn, createOrder)
router.route("/order/:id").get(isLoggedIn, getOrder)
router.route("/myOrders").get(isLoggedIn, getMyOrders)


module.exports = router;
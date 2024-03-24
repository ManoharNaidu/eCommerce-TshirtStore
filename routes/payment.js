const express = require('express');
const router = express.Router();
const { isLoggedIn, customRole } = require('../middlewares/user');

const { sendStripeKey,sendRazorpayKey , CaptureStripePaymet, CaptureRazorpayPayment } = require('../controllers/paymentController');

router.route("/payment/getStripe").get(isLoggedIn, sendStripeKey)
router.route("/payment/getRazorpay").get(isLoggedIn, sendRazorpayKey)

router.route("/payment/stripe").post(isLoggedIn, CaptureStripePaymet)
router.route("/payment/razorpay").post(isLoggedIn, CaptureRazorpayPayment)


module.exports = router;
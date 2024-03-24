const bigPromise = require('../middlewares/bigPromise');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const razorpay = require('razorpay');

exports.sendStripeKey = bigPromise(async (req, res,next) => {
    res.json({
        stripeKey : process.env.STRIPE_API_KEY
    })
});

exports.sendRazorpayKey = bigPromise(async (req, res,next) => {
    res.json({
        RazorpayKey : process.env.RAZORPAY_KEY_ID
    })
})

exports.CaptureStripePaymet = bigPromise(async (req, res,next) => {
    const paymentIntent = await stripe.paymentIntents.create({
        amount : req.body.amount*100,
        currency : 'inr',
        payment_method_types : ['card'],
        description : 'Software development services',
        shipping : {
            name : req.body.name,
            address : {
                line1 : req.body.address,
                postal_code : req.body.postal_code,
                city : req.body.city,
                state : req.body.state,
                country : req.body.country
            }
        },
        receipt_email : req.body.email,
        // optional
        metadata : {integration_check : 'accept_a_payment'}
    })

    res.status(200).json({
        success : true,
        client_secret : paymentIntent.client_secret
    });
})

exports.CaptureRazorpayPayment = bigPromise(async (req, res,next) => {
    var instance = new razorpay({
        key_id : process.env.RAZORPAY_KEY_ID,
        key_secret : process.env.RAZORPAY_SECRET_KEY
    })
    var options = {
        amount : req.body.amount*100,
        currency : 'INR',
        receipt : 'receipt#1',
    }
    const MyOrder = instance.orders.create(options)
    res.status(200).json({
        success : true,
        order : MyOrder
    })
})


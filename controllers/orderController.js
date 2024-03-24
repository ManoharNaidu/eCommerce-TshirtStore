const Order = require("../models/order");
const Product = require("../models/product");
const bigPromise = require("../middlewares/bigPromise");

exports.createOrder = bigPromise(async (req, res, next) => {
    const { shippingInfo, orderItems, paymentInfo, taxAmount, shippingAmount, totalAmount} = req.body

    const order = await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        taxAmount,
        shippingAmount,
        totalAmount,
        user: req.user._id
    })
    res.status(200).json({
        success: true,
        order
    })
})

exports.getOrder = bigPromise(async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate("user", "name email") 
    if(!order){
        return res.status(404).json({
            success: false,
            message: "Order not found"
        })
    }
    res.status(200).json({
        success: true,
        order
    })
})

exports.getMyOrders = bigPromise(async (req, res, next) => {
    const orders = await Order.find({user : req.user._id})
    res.status(200).json({
        success: true,
        orders
    })
})
const Order = require("../models/order");
const Product = require("../models/product");
const bigPromise = require("../middlewares/bigPromise");
const CustomError = require("../utils/customError");

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

exports.adminGetAllOrders = bigPromise(async (req, res, next) => {
    const orders = await Order.find()
    res.status(200).json({
        success: true,
        orders
    })
})

exports.adminGetOneOrder = bigPromise(async (req, res, next) => {
    const order = await Order.findById(req.params.id)
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

exports.adminUpdateOrder = bigPromise(async (req, res, next) => {
    const order = await Order.findById(req.params.id)
    if(!order){
        return res.status(404).json({
            success: false,
            message: "Order not found"
        })
    }
    if(order.orderStatus === "Delivered"){
        return next(new CustomError("Order already marked delivered", 400))
    }
    order.orderStatus = req.body.orderStatus
    order.orderItems.forEach(async prod => {
        await UpdateProductStock(prod.product, prod.quantity)
    })
    await order.save()
    res.status(200).json({
        success: true,
        order
    })
})

exports.adminDeleteOneOrder = bigPromise(async (req, res, next) => {
    const order = await Order.findById(req.params.id)
    if(!order){
        return res.status(404).json({
            success: false,
            message: "Order not found"
        })
    }
    await Order.deleteOne({_id : req.params.id})
    res.status(200).json({
        success: true,
        message: "Order deleted"
    })
})

async function UpdateProductStock(productId, quantity){
    const product = await Product.findById(productId)
    product.stock = product.stock - quantity
    await product.save({validateBeforeSave : false})
}
const mongoose = require('mongoose');

/* 
shoppingInfo {}
user
paymentInfo[]
taxAmount
shippingAmount
totalAmount
orderStatus
deliveredAt
createdAt
-----------------
oderItems [{}]
-name
- quantity
- image [{}]
- price
- product
*/

const orderSchema = new mongoose.Schema({
    shippingInfo: {
        address : {
            type : String,
            required : true
        },
        city : {
            type : String,
            required : true
        },
        phone : {
            type : String,
            required : true
        },
        postalCode : {
            type : String,
            required : true
        },
        state : {
            type : String,
            required : true
        },
        country : {
            type : String,
            required : true
        },
    },
    user : {
        type : mongoose.Schema.ObjectId,
        ref : "User",
        required : true
    },
    orderItems : [
        {
            name : {
                type : String,
                required : true
            },
            quantity : {
                type : Number,
                required : true
            },
            image : {
                type : String,
                required : true
            },
            price : {
                type : Number,
                required : true
            },
            product : {
                type : mongoose.Schema.ObjectId,
                ref : "Product",
                required : true
            },
        }
    ],
    paymentInfo : {
        id : {
            type : String
        }
    },
    taxAmount : {
        type : Number,
        required : true,
        default : 0.0
    },
    shippingAmount : {
        type : Number,
        required : true,
        default : 0.0
    },
    totalAmount : {
        type : Number,
        required : true,
        default : 0.0
    },
    orderStatus : {
        type : String,
        required : true,
        default : "Processing"
    },
    deliveredAt : {
        type : Date
    },
    createdAt : {
        type : Date,
        default : Date.now
    }
})

module.exports = mongoose.model("Order", orderSchema);
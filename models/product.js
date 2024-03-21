const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name : {
        type : String,
        required : [true, "Name is required"],
        trim : true,
        maxLength : [100, "Name cannot exceed 100 characters"]
    },
    price : {
        type : Number,
        required : [true, "Price is required"],
        maxLength : [5, "Price cannot exceed 5 digits"],
    },
    description : {
        type : String,
        required : [true, "Description is required"],
    },
    photos : [
        {
            id : {
                type : String,
                required : true
            },
            secure_url : {
                type : String,
                required : true
            }
        }
    ],
    category : {
        type : String,
        required : [true, "Select Category from - short-sleeves, long-sleeves, sweat-shirt, hoodies"],
        enum : {
            values : [
                "shortsleeves",
                "longsleeves",
                "sweatshirt",
                "hoodies"
            ],
            message : "Please select correct category for product"
        }
    },
    brand : {
        type : String,
        required : [true, "Brand is required"],
    },
    ratings : {
        type : Number,
        default : 0
    },
    numberOfReviews : {
        type : Number,
        default : 0
    },
    reveiws : [
        {
            user : {
                type : mongoose.Schema.ObjectId,
                ref : "User",
                required : true
            },
            name : {
                type : String,
                required : true
            },
            rating : {
                type : Number,
                required : true
            },
            comment : {
                type : String,
                required : true
            }
        }
    ],
    user : {
        type : mongoose.Schema.ObjectId,
        ref : "User",
        required : true
    },
    createdAt : {
        type : Date,
        default : Date.now
    }
})


module.exports = mongoose.model('Product', productSchema);
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

require('dotenv').config({path: '../env'});

const userSchema = new mongoose.Schema({
    name : {
        type: String,
        required: [true, "Please tell us your name"],
        maxLength: [40, "A user name must have less or equal than 40 characters"],
    },
    email : {
        type: String,
        required: [true, "Please tell us your email"],
        validate : [validator.isEmail, "Please provide a valid email"],
        unique: true,
    },
    password : {
        type: String,
        required: [true, "Please provide a password"],
        minLength: [8, "A password must have more or equal than 8 characters"],
        select : false,
    },
    role : {
        type: String,
        default: 'user',
    },
    photo : {
        id : {
            type : String,
            required : true,
        },
        secureURL : {
            type : String,
            required : true,
        },
    },
    forgotPasswordToken : String,
    forgotPasswordExpires : Date,
    createdAt : {
        type: Date,
        default: Date.now,
    },
})

// HOOKS

// encrypt password using bcrypt by pre save hook
userSchema.pre("save", async function(next){

    if(!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 10);
})

// creating a method to validate password
userSchema.methods.IsValidPassword = async function(userPassword){
    return await bcrypt.compare(userPassword, this.password);
}

// creating jwt
userSchema.methods.createJWTToken = function(){
    return jwt.sign({id: this._id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRY,
    })
}

// generate forgot password (string)

userSchema.methods.getForgotPasswordToken = function(){
    // generate a long and random string
    const forgotToken = crypto.randomBytes(20).toString('hex');

    // hash the token and set to forgotPasswordToken // also use the hash function at backend 
    this.forgotPasswordToken = crypto.createHash('sha256').update(forgotToken).digest('hex');

    this.forgotPasswordExpires = Date.now() + 5 * 60 * 1000;

    return forgotToken;
}

module.exports = mongoose.model('User', userSchema);
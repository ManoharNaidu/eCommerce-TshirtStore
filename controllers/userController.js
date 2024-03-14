const User = require('../models/user');
const bigPromise = require('../middlewares/bigPromise');
const CustomError = require('../utils/customError');
const cookieToken = require('../utils/cookieToken');
const fileupload = require('express-fileupload')
const cloudinary = require('cloudinary');

exports.signup = bigPromise( async (req,res,next) => {
    

    if(!req.files){
        return next(new CustomError('Please upload a photo', 400))
    }

    const {name,email,password} = req.body;

    if (!email || !password || !name) {
        return next(new CustomError('Name, email and password fields are required', 400))
    }

    let result;
    let file = req.files.photo
    result = await cloudinary.v2.uploader.upload(file.tempFilePath,{
        folder: "TshirtStore/user",
        width: 150,
        crop: "scale",
    })

    const user = await User.create({
        name,
        email,
        password,
        photo : {
            id : result.public_id,
            secureURL : result.secure_url,
        }
    })
    cookieToken(user,res);
})

exports.login = bigPromise( async (req,res,next) => {
    const {email,password} = req.body;

    if (!email || !password) {
        return next(new CustomError('Email and password fields are required', 400))
    }

    // get user from db
    let user = await User.findOne({email}).select('+password');

    // check if user exists
    if (!user) {
        return next(new CustomError('Invalid email or password', 400))
    }
    
    // check if password is correct
    const isPasswordMatch = await user.IsValidPassword(password);
    if(!isPasswordMatch){
        return next(new CustomError('Invalid email or password', 400))
    }
    // return jwt
    cookieToken(user,res);

})

exports.logout = bigPromise( async (req,res,next) => {
    res.cookie('token',null,{
        expires : new Date(Date.now()),
        httpOnly : true,
    })
    res.status(200).json({
        success : true,
        message : 'Logged out successfully',
    })
}

)
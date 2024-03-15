const User = require('../models/user');
const bigPromise = require('../middlewares/bigPromise');
const CustomError = require('../utils/customError');
const cookieToken = require('../utils/cookieToken');
const fileupload = require('express-fileupload')
const cloudinary = require('cloudinary');
const sendEmail = require('../utils/emailHelper');
const crypto = require('crypto');

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
})

exports.forgotPassword = bigPromise( async (req,res,next) => {
    const {email} = req.body;

    const user = await User.findOne({email});

    if(!user){
        return next(new CustomError('There is no user with this email', 404))
    }

    const forgotToken = user.getForgotPasswordToken()

    await user.save({validateBeforeSave : false});

    console.log(req.get("host"));

    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/resetPassword/${forgotToken}`;
    const message = `Did you forgot your password? If not Ignore this mail`
    const html = `Enter your password to this url to reset passwrod: ${resetURL}`;

    try{
        await sendEmail({
            email : user.email,
            subject : 'TshiirtStore Password Reset (valid for 5 minutes)',
            message : message,
            html : html
        })
        res.status(200).json({
            success : true,
            message : 'Email sent successfully',
        })

    }catch(err){
        user.forgotPasswordExpires = undefined;
        user.forgotPasswordToken = undefined;
        await user.save({validateBeforeSave : false});
        return next(new CustomError(err.message, 500))
    }

})

exports.resetPassword = bigPromise( async (req,res,next) => {
    const {resetToken} = req.params;
    const {password} = req.body;

    if(!password){
        return next(new CustomError('Password fields are required', 400))
    }
    const token = crypto.createHash('sha256').update(resetToken).digest('hex');
    const user = await User.findOne({
        forgotPasswordToken : token,
        forgotPasswordExpires : {$gt : Date.now()}
    })

    if(!user){
        return next(new CustomError('Invalid token or token expired', 400))
    }

    user.password = password;
    user.forgotPasswordExpires = undefined;
    user.forgotPasswordToken = undefined;
    await user.save();

    cookieToken(user,res);
})


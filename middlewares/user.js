const bigPromise = require('./bigPromise');
const User = require('../models/user');
const CustomError = require('../utils/customError');
const jwt = require('jsonwebtoken');

exports.isLoggedIn = bigPromise( async (req,res,next) => {
    let token = req.cookies.token
    if (!token) {
        token = req.headers.authorization;
        if(!token){
            return next(new CustomError('You are not logged in', 401))
        }
        else token = token.split(' ')[1];
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if(!user){
        return next(new CustomError('User does not exist', 401))
    }
    req.user = user;
    next();

})
const Product = require('../models/product');
const bigPromise = require('../middlewares/bigPromise');
const CustomError = require('../utils/customError');
const cloudinary = require('cloudinary');

exports.addProduct = bigPromise( async (req,res,next) => {
    // handling images

    if(!req.files){
        return next(new CustomError('Images are required', 400))
    }
    let productImages = [];
    for(let i = 0; i < req.files.photos.length; i++){
        let result = await cloudinary.v2.uploader.upload(req.files.photos[i].tempFilePath, {
            folder : "TshirtStore/product"
        });
        productImages.push({
            id : result.public_id,
            secure_url : result.secure_url
        });
    }
    // handling product details
    req.body.photos = productImages;
    req.body.user = req.user.id;

    let product = await Product.create(req.body);
    res.status(201).json({
        success : true,
        data : product
    })
})
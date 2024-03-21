const Product = require('../models/product');
const bigPromise = require('../middlewares/bigPromise');
const CustomError = require('../utils/customError');
const cloudinary = require('cloudinary');
const WhereClause = require('../utils/whereClause');

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

exports.getProducts = bigPromise( async (req,res,next) => {
    const resultPerPage = 1;
    const totalProducts = await Product.countDocuments();

    const products = new WhereClause(Product.find(),req.query).search().filter().pager(resultPerPage)
    const result = await products.base.clone();
    const filteredProducts = result.length;
    res.status(200).json({
        success : true,
        result,
        totalProducts,
        filteredProducts,
    })
})

exports.getOneProduct = bigPromise( async (req,res,next)=>{
    const product = await Product.findById(req.params.id);
    if(!product){
        return next(new CustomError('Product not found', 404))
    }
    res.status(200).json({
        success : true,
        product
    })
})

exports.AdminupdateOneProduct = bigPromise( async (req, res, next) => {
    var product = await Product.findById(req.params.id);
    if(!product){
        return next(new CustomError('Product not found', 404))
    }
    if(product.user.toString() !== req.user.id || req.user.role !== 'admin'){
        return next(new CustomError('You are not allowed to update this product', 401))
    }
    let productImages = [];

    if(req.files){
        // delete the previous images
        for(let i = 0; i < product.photos.length; i++){
            const res = await cloudinary.v2.uploader.destroy(product.photos[i].id);
        }  

        // add new images
        for(let i = 0; i < req.files.photos.length; i++){
            let result = await cloudinary.v2.uploader.upload(req.files.photos[i].tempFilePath, {
            folder : "TshirtStore/product"
            });

        productImages.push({
            id : result.public_id,
            secure_url : result.secure_url
        });
        }
        req.body.photos = productImages;
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new : true,
        runValidators : true,
        useFindAndModify : false
    })

    res.status(200).json({
        success : true,
        product
    })
})

exports.AdminGetProducts = bigPromise( async (req,res,next) => {
    const products = await Product.find();
    res.status(200).json({
        success : true,
        data : products
    })
})

exports.deleteOneProduct = bigPromise( async (req,res,next) => {
    const product = await Product.findById(req.params.id);
    if(!product){
        return next(new CustomError('Product not found', 404))
    }

    if(product.user.toString() !== req.user.id || req.user.role !== 'admin'){
        return next(new CustomError('You are not allowed to delete this product', 401))
    }

    for(let i = 0; i < product.photos.length; i++){
        const res = await cloudinary.v2.uploader.destroy(product.photos[i].id);
    }

    // await product.remove();
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({
        success : true,
        message : 'Product deleted successfully'
    })
})
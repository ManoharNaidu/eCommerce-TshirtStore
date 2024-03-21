const BigPromise = require('../middlewares/bigPromise');

exports.home = BigPromise( (req, res) => {
    res.status(200).json({
        status : true,
        message : "Welcome to the Home Page"
    })
}) // can use async await

exports.homedummy = (req, res) => {
    res.status(200).json({
        status : true,
        message : "Welcome to the Dummy Page in manu branch"
    })
}
exports.home = (req, res) => {
    res.status(200).json({
        status : true,
        message : "Welcome to the Home Page"
    })
}

exports.homedummy = (req, res) => {
    res.status(200).json({
        status : true,
        message : "Welcome to the Dummy Page"
    })
}
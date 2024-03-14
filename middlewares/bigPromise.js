// try catch and async await and use promise

module.exports = func => (req,res,next) => {
    Promise.resolve(func(req,res,next)).catch(next)
}
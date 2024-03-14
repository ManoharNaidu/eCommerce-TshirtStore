const mongoose = require('mongoose');
const { DB_URI } = process.env

const connectDB = async () => {
    mongoose.connect(DB_URI, {})
    .then(console.log('Connected to the database'))
    .catch( err =>{
        console.log('Error connecting to the database')
        console.log(err)
        process.exit(1)
    })
}

module.exports = connectDB;
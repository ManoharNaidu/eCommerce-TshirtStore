require('dotenv').config();

const express = require('express');
const app = express();
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');

// swagger doc
const swaggerUi = require('swagger-ui-express');
const fs = require("fs")
const file  = fs.readFileSync('./swagger.yaml', 'utf8')
const swaggerDocument = require('yaml').parse(file)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// regular middlewares
app.use(express.json());
app.use(express.urlencoded({extended:true}));

// temp checking ejs
app.set('view engine', 'ejs');

// cookie parser and fileupload
app.use(cookieParser());
app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));



app.use(morgan("tiny"))


// importing all routes
const home = require('./routes/home');
const user = require('./routes/user');
const product = require('./routes/product');
const payment = require('./routes/payment');
const order = require('./routes/order');

app.use("/api/v1",home);
app.use("/api/v1",user);
app.use("/api/v1",product);
app.use("/api/v1",payment);
app.use("/api/v1",order);

app.get("/singuptest",(req,res) => {
    res.render('signuptest');
})

module.exports = app;
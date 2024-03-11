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

// cookie parser and fileupload
app.use(cookieParser());
app.use(fileUpload());



app.use(morgan("tiny"))

const home = require('./routes/home');

app.use("/api/v1",home);


module.exports = app;
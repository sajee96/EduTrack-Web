require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const createError = require('http-errors');
const expressLayout = require('express-ejs-layouts');

const connectDB = require('./server/config/db');
const AuthRoute = require('./server/routes/main');

const app = express();
app.use(morgan('dev'));
const PORT = 5000 || process.env.PORT;

// connect to db
connectDB();

app.use('/auth', AuthRoute);
// app.use(async (req, res, next)=>{
//     const error = new Error('Not Found');
//     error.status = 404;
//     next(error);
//     // next(createError.NotFound('test'));
// });


app.use(async (err, req, res, next)=>{
    res.status(err.status || 500);
    res.send({
        error:{
            status: err.status || 500,
            message: err.message,
        },
    });
});

app.use('/auth', AuthRoute);

app.use(express.static('pub'))
//Templating Engine
app.use(expressLayout);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

app.use('/', require('./server/routes/main'));    

app.listen(PORT, ()=>{
    console.log(`App listening on port ${PORT}`);
});
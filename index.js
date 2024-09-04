const express=require("express");
const app=express();
const port=3000;
const db=require('./config/mongoose');
const expressLayouts=require('express-ejs-layouts');
const cors=require('cors');
const errorHandler=require('./helpers/errorHandler');
const cookieParser=require('cookie-parser')
require('dotenv').config();
app.use(cookieParser())
app.use(cors())
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// extract styles and scripts from subpages into the layouts
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

// set the view engine to ejs
app.set("view engine", "ejs");
// app.set("views", "views");


// use assets
app.use(express.static('./assets'));



// use express router
app.use('/', require('./router'));

// Make the uploads path available
app.use('/uploads', express.static(__dirname+'/uploads'))

// global error handler
app.use(errorHandler);

app.listen(port, () => {
    console.log(`http://localhost:${port}`);
})
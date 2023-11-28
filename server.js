const color = require('colors');
const express = require('express');
const dotenv = require('dotenv');
const {ConnectionToDB} = require("./connection");
const userRouter = require('./routes/user.js');

const {authenticateUser} = require('./middlewares/authenticationMiddleWare');
dotenv.config();



const app = express();


app.use('/user',userRouter);
app.get('/dashboard',authenticateUser,(req,res) => {
    res.send({message : "testing"});
})
app.listen(process.env.PORT,() => {
    ConnectionToDB();
    console.log('listening to port' ,`localhost:${process.env.PORT}`);
})


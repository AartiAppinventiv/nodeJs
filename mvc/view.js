const express = require('express')
const mongoose = require('mongoose')
const model = require('./model')
const controller = require('./controller')

const app = express();
app.use(express.json())

mongoose.connect('mongodb://localhost:27017/usersdb',{useNewUrlParser: true})

app.post('/sign',(req,res)=>{
    controller.SignPost(req,res);
})
app.post('/login',(req,res)=>{
    controller.LoginPost(req,res);
})
app.get('/:name',controller.verifyToken,(req,res)=>{
    controller.getdob(req,res);
})
app.listen(3000,()=>{
    console.log('server is started on port 3000');
})
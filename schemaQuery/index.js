const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const controller = require('./controller')

const app = express()
app.use(express.json())

mongoose.set('debug',true)
mongoose.connect("mongodb://localhost:27017/postsdb",{useNewUrlParser:true},()=>{
    console.log('connection successfull');
})

app.post('/signup',(req,res)=>{
    controller.UserSignup(req,res);
})
app.get('/allusers',(req,res)=>{
    controller.getUser(req,res);
})
app.post('/login',(req,res)=>{
    controller.loginUser(req,res);
})
app.post('/addpost',controller.verifyToken,(req,res)=>{
    controller.postAdd(req,res);
})

app.post('/commentpost/:postid',controller.verifyToken,(req,res)=>{
    controller.commentPost(req,res)
})

app.post('/likepost/:postid',controller.verifyToken,(req,res)=>{
    controller.likepost(req,res);
})

app.post('/reportpost/:postid',controller.verifyToken,(req,res)=>{
    controller.reportPost(req,res);
})

app.get('/listbytype',(req,res)=>{
    controller.listbytype(req,res);
})
app.get('/getpostbytype/:type',controller.verifyToken,(req,res)=>{
    controller.postBytype(req,res);
})
app.listen(4000,()=>{
    console.log('server is started on port 4000')
})
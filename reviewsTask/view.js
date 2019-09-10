const express = require('express')
const mongoose = require('mongoose')

const controller = require('./controller')
const app = express()
app.use(express.json())

mongoose.connect("mongodb://localhost:27017/usersdb",{useNewUrlParser:true},()=>{
    console.log('connection successfull');
})

app.post('/SellerAdded',(req,res)=>{
    controller.SellerSignup(req,res);
})
app.post('/SellerLogin',(req,res)=>{
    controller.SellerLogin(req,res);
})
app.post('/ProductAdded',controller.verifyToken,(req,res)=>{
    controller.ProductAdded(req,res);
})
app.put('/ProductUpdate/:id',controller.verifyToken,(req,res)=>{
    controller.ProductUpdate(req,res);
})
app.delete('/ProductDelete/:id',controller.verifyToken,(req,res)=>{
    controller.ProductDelete(req,res);
})

app.post('/CustomerAdded',(req,res)=>{
    controller.CustomerSignup(req,res);
})
app.post('/CustomerLogin',(req,res)=>{
    controller.CustomerLogin(req,res);
})
app.get('/getalluser',(req,res)=>{
    controller.getuserdetails(req,res);
})
app.get('/getallproducts',(req,res)=>{
    controller.findproduct(req,res);
})
app.get('/buyproducts/:id',controller.verifyTokenuser,(req,res)=>{
    controller.buyproduct(req,res);
})
app.listen(3000,()=>{
    console.log('server is started on port 3000')
})

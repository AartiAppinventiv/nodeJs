const express = require('express')
const app = express();
app.use(express.json())
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const model = require('./admin')
const productmodel = require('./product')
const usermodel = require('./users')

global.productid = undefined;
global.sellerid = undefined;
global.customerid = undefined;


module.exports = {
    SellerSignup(req,res) {
        let result = req.body
        //result.ProductId = productid
        const password = req.body.password
        var hash_password = bcrypt.hashSync(password, 10);
        result.password = hash_password ;
        model.create(result,(err,data)=>{
            if (err) res.send(err)
            else
            res.json({
                msg:'New seller is added',
                data:result
            })
        })
    },
    async SellerLogin(req,res){
        let user = req.body;
        //user.ProductId = productid
        let found = false;
        const query =await model.findOne({email:user.email})
        let pass = bcrypt.compare(req.body.password,model.password);
                 
       // console.log(pass);   
        if(pass){
            found = true;
            sellerid = query._id
            //console.log(sellerid)
            if(!query)
            return res.send('user not found')
            //console.log(query._id)
            var tokken =  jwt.sign({id : query._id,email:query.email}, 'secretkey')
        
            res.json({msg: tokken }) 
       // console.log(query)
        
    }},
    ProductAdded(req,res){
        let product = req.body;
        product.AdminId = sellerid
        //console.log(product.AdminId)
        productmodel.create(product, async(err,data)=>{
            if(err) res.send(err)
            else 
            var value = await model.findById(sellerid)
            //console.log(value)
            value.ProductId.push(data._id)
            await value.save();
            res.json({
                msg:'product added by seller',
                data:product
            })
        })
               
    }, 
    async ProductUpdate(req,res){
        let product = req.body;
        let result = await productmodel.update({_id: req.params.id},{$set:{name:req.body.name}})
        //let result = await productmodel.update({_id: req.params.id},product)
       
        res.send({
            msg:'updated successfully',
            data:result
        })
        
    },
    async ProductDelete(req,res){
        let result = await productmodel.deleteOne({_id:req.params.id})
        res.json({
            msg:"deleted",
            data:result
        })
    },

    CustomerSignup(req,res){
        let result = req.body
        //result.ProductId = productid
        const password = req.body.password
        var hash_password = bcrypt.hashSync(password, 10);
        result.password = hash_password ;
        usermodel.create(result,(err,data)=>{
            if (err) res.send(err)
            else
            res.json({
                msg:'New Customer is added',
                data:result
            })
        })

    },
    async CustomerLogin(req,res){ 
        let user = req.body;
        //user.ProductId = productid
        let found = false;
        const query =await usermodel.findOne({email:user.email})
        let pass = bcrypt.compare(req.body.password,usermodel.password);
                 
       // console.log(pass);   
        if(pass){
            found = true;
            customerid = query._id
            //console.log(customerid)
            if(!query)
            return res.send('user not found')
            var tokken =  jwt.sign({id : query._id,email:query.email}, 'secretkey')
        
            res.json({tokken});
        }
    },
    async getuserdetails(req,res){
        let data = await usermodel.find({})
        res.json(data)

    },
    async findproduct(req,res){
      let data =  await productmodel.find({})
        res.json(data)

    },
    async buyproduct(req,res){
       // console.log(req.user,"user")
        try{
            let data = req.params.id
            //console.log(customerid)
            //var value = await usermodel.findOne({_id:req.user})
            var value = await usermodel.findOne({_id:customerid})
            //console.log(value, "value")
            value.ProductId.push(data)
            await value.save();
            res.send(value);
        }catch(err){
            res.send(err.message)
        }
        
             
    },

    verifyToken(req,res,next){
        const bearerHeader = req.headers['authorization'];
        if (typeof bearerHeader !== 'undefined') {
            //console.log(bearerHeader)
            const bearer = bearerHeader.split(' ');
            // Get token from array
            //console.log(bearer)
            const bearerToken = bearer[1];
            // Set the token
            req.token = bearerToken;
            try {
                //console.log(bearerToken);
                var decoded = jwt.verify(bearerToken, 'secretkey');
                console.log(decoded);
                if (typeof decoded !== 'undefined') {
                   sellerid = decoded.id;
                  //s console.log(sellerid);
                    next();
                } else {
                    res.sendStatus(403);
                }
            } catch (e) {
                res.status(500).json({
                    message: e.message
                })
            }


        } else {
            // Forbidden
            res.sendStatus(403);
        }
    },
    verifyTokenuser(req,res,next){
        const bearerHeader = req.headers['authorization'];
        if (typeof bearerHeader !== 'undefined') {
            //console.log(bearerHeader)
            const bearer = bearerHeader.split(' ');
            // Get token from array
            //console.log(bearer)
            const bearerToken = bearer[1];
            // Set the token
            req.token = bearerToken;
            try {
                //console.log(bearerToken);
                var decoded = jwt.verify(bearerToken, 'secretkey');
                console.log(decoded);
                if (typeof decoded !== 'undefined') {
                   customerid = decoded.id;
                   //req.user = decoded.id
                  //s console.log(sellerid);
                    next();
                } else {
                    res.sendStatus(403);
                }
            } catch (e) {
                res.status(500).json({
                    message: e.message
                })
            }


        } else {
            // Forbidden
            res.sendStatus(403);
        }
    }

}

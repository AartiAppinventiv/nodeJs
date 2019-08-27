const express = require('express')
const cookieParser = require('cookie-parser');
const app = express()
app.use(express.json())

//app.use(cookieParser())

const members = 
    {
        id:1,
        firstName:"aarti",
        lastName:"verma",
        address:"Noida"
    }


app.post('/',(req,res,next)=>{

    let newMem;
    newMem=req.body;
    console.log(req.body)
    //newMem=cookieParser.JSONCookie(newMem)
    console.log(req.body.id)
   next()
    
},(req,res)=>{
    if(req.body.id == members.id && req.body.firstName == members.firstName && req.body.lastName == members.lastName && req.body.address == members.address){
        // if(newMem===members){  
            console.log("inside")
        res.status(200).send('data exist');
            
        }
        else
        {
            res.status(400).send('data  does not exist');
        }
    
})

app.listen(4000,()=>{
    console.log('server is started on port 4000');
})
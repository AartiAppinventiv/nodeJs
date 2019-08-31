const express = require('express')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const fs = require('fs')

const saltrounds = 10;
// const myPlaintextPassword = req.body;

 // true

const app = express()
app.use(express.json())
const {student,subject} = require('./model');
const login = require('./login');
const signup = require('./signup.js');


app.get('/api',(req,res)=>{
    res.json({
        message:student
    })
})

//add the new student
app.post('/api/student',verifyToken,(req,res)=>{
    let newuser = req.body;
    // console.log("comp2")
    // console.log(req.token);
    //console.log(newuser);
    
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if(err) {
          res.sendStatus(403);
        } else {
            student.push(newuser);
            //console.log(student);
            res.json({
                message : student
            })
        }
      });
})

//add the subject into student
app.post('/api/attend/:name',verifyToken,(req,res)=>{
    let newSub = req.body.sub;
    console.log(student)
    jwt.verify(req.token, 'secretkey', (err, authData)=>{
        if(err){
            res.sendStatus(403);
        }else{
            student.forEach((data)=>{
                console.log(data)
                if(data.name == req.params.name){
                    data.subject_attended.push(newSub);
                    res.send(data)
                }
            })
        }
    })
})

app.get('/',(req,res)=>{
    res.json(signup);
})

//signup
app.post('/api/signup',(req,res)=>{
    let newdata = req.body;
    let found = false;
    const password = req.body.password
    var hash_password = bcrypt.hashSync(password, 10);
    newdata.password = hash_password ;

 
    let value;
    signup.forEach((data)=>{
        if(data.email == req.body.email){
            //console.log('passed')
            found = true;
            //value = data;
            return
        }
    })
    if(!found){
        signup.push(newdata);
        
       let tokken =  jwt.sign({newdata}, 'secretkey')
       
        
        res.json({msg:"Created account"+tokken});
    }
    else{
        res.status(404).json({msg:"email already exists"});
    }

})

//login get
app.get('/getlogin',(req,res)=>{
    res.json(login);
})

//token generation
app.post('/api/login', (req, res) => {
    const user = req.body;
    let found = false;
    
    const password = req.body.password
   
    login.forEach((data)=>{
        if(data.email == req.body.email){
        let pass = bcrypt.compare(req.body.password, data.password);
                 
        console.log(pass);   
        if(pass){
                found = true;
            }

        }
    })
    if(found){
        let tokken =  jwt.sign({user}, 'secretkey')
       
        res.json({msg:"You are login successfully"+tokken});
    }
    else{
        res.status(404).json({msg:"email doesn't exist"});
    }
  
    
});
  
//Verify token

function verifyToken(req,res,next){
    const bearerHeader = req.headers['authorization'];

        console.log(bearerHeader)

    if(typeof bearerHeader != 'undefined'){
        console.log("comp")
        const bearer = bearerHeader.split(' ');

        // Get token from array
        const bearerToken = bearer[1];
        // Set the token
        req.token = bearerToken;
        // Next middleware
        next();
    } 
    else {
        // Forbidden
        res.sendStatus(403);
    }

}


app.listen(4000,()=>{
    console.log('server is started on port 4000');
})  

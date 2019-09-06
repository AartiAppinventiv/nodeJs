const model = require('./model')
const jwt = require('jsonwebtoken')

module.exports = {
    async SignPost(req,res) {
        let newData = req.body;
        let data = await model.create(newData, (err,result)=>{
            if(err)  res.send(err);
            else 
            res.json({
                msg:'New user is added',
                data: newData
            })
            
        });
               
    },
    async LoginPost(req,res){
        let user = req.body;
        const query =await model.findOne({email:user.email,password:user.password})
        console.log(query)
        if(!query)
        return res.send('user not found')
        var tokken =  jwt.sign({user}, 'secretkey')
       
         res.json({msg:"You are login successfully"+tokken});

    },
    async getdob(req,res){
        const query = await model.findOne({name:req.params.name})
        console.log(query)
        if(!query)
        return res.send('user not found')
        const getAge = Math.floor(
            (new Date() - new Date(query.dob).getTime()) / 3.15576e10
        );
        res.json({data:getAge})


    },

      
    //Verify token

    verifyToken(req,res,next){
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
       
    
}
const express = require('express')
const jwt = require('jsonwebtoken')
const app = express();
app.use(express.json())
const mongoose = require('mongoose')



const bcrypt = require('bcrypt')
const usermodel = require('./model/user')
const postmodel = require('./model/posts')
const actionmodel = require('./model/post_actions')

global.userid = undefined

module.exports = {
    UserSignup(req,res){
        let result = req.body
        const password = req.body.password
        var hash_password = bcrypt.hashSync(password, 10);
        result.password = hash_password ;
        usermodel.create(result,(err,data)=>{
            if (err) res.send(err)
            else
            res.json({
                msg:'New account is created',
                data:result
            })
        })
    },
    async getUser(req,res){
        let result = await usermodel.find({})
        res.json(result)
    },
    async loginUser(req,res){
        let user = req.body;
        let found = false;
        const query =await usermodel.findOne({email:user.email})
        let pass =  bcrypt.compare(req.body.password,usermodel.password)
            if(pass){
                found = true;
                userid = query._id;
                if(!query)
                return res.send('user not found')
                else
                var tokken =  jwt.sign({id : query._id,email:query.email}, 'secretkey')
    
                res.json({msg: tokken }) 
                //res.json({msg:"login successfully"});
            
            }
                 
       // console.log(pass);   
        

    },
    async postAdd(req,res){
        let post = req.body;
        post.UserId = userid;
        
        postmodel.create(post,async (err,data)=>{
            if(err) res.send(err)
            else
                    
            var postimg = await postmodel.find({type:'image'})
            if(postimg)
            { 
            let image = await usermodel.updateOne({_id:userid}, {$inc : {ImageCount : 1}})
            }
            var postvid = await postmodel.find({type:'video'})
            if(postvid){
            
            let video = await usermodel.updateOne({_id:userid}, {$inc : {VideoCount : 1}})
            //console.log(video,'try')
            }



            res.json({
                msg:'post added',
                data:post
            })
        })

    },

    async commentPost(req,res){
        let result = req.body;
        let postid = req.params.postid;
        let postdata = await postmodel.updateOne({_id:postid} , {$inc : {commentCount : 1}})
        
        let action =  {
            comment : {
                UserId : userid ,
                PostId  : postid ,
                commentText : result.commentText,
                created_at:Date.now()
            }
        }
        
        let data = await actionmodel.create(action)

        

        res.json({
            msg:'comment',
            data:data ,
            post  : postdata
        })
        
         

    },

    async likepost(req,res){
        //console.log('fgh')

        let postid = req.params.postid;
        let getlike =  {
            likes : {
                UserId : userid ,
                PostId  : postid 
            }
        }
        //console.log(getlike)

        let data = await actionmodel.findOne({'likes.UserId' : userid , 'likes.PostId' : postid})
        //console.log(data)
            if(data)
            {
            
            let postdata = await postmodel.updateOne({_id:postid},{$inc:{likeCount:-1}})
            let data = await actionmodel.deleteOne({'likes.UserId':userid},{'likes.PostId': postid})
                res.json({
                    msg:'disliked',
                    data:data ,
                    post  : postdata
                })
            }
           else{
                let postdata = await postmodel.updateOne({_id:postid},{$inc:{likeCount:1}})
                let action =  {
                    likes : {
                        UserId : userid ,
                        PostId  : postid,
                        created_at:Date.now() 
                    }
                }
                //console.log(action)
                
                let data = await actionmodel.create(action)
                //console.log(data)
                res.json({
                    msg:'liked',
                    data:data ,
                    post  : postdata
                })

            }

            
    


    },

    async reportPost(req,res){
        let postid = req.params.postid;
        let getreport = {
            reports  : {
                data : req.body.data ,
                PostId :  postid,
                UserId : userid
            }
        }

        
        let totalcount = await postmodel.findOne({_id : postid }) ;
        console.log(totalcount) 

        if(totalcount.reports  > 3){
            await postmodel.deleteOne({_id : postid})
        }else{
            await actionmodel.create(getreport) ;
            await postmodel.updateOne({_id : postid} , {$inc : { reportCount : 1  } })
        }

            res.json({
                message : 'success'
            })
    },

    async listbytype(req,res){
        //console.log(userid)

        let usersData =  await usermodel.find({_id:mongoose.Types.ObjectId(userid)})
        console.log(usersData)
        let imageData = await postmodel.aggregate([
                {$match:{UserId:mongoose.Types.ObjectId(userid),type:'image'}},
                {$limit:5},
                {$lookup:{from:"postsactions",let:{userid:'$UserId',postid:'$_id'},
                pipeline:[{$match:{$expr:{$and:[{$eq:['$likes.UserId','$$userid']},{$eq:['$likes.PostId','$$postid']}]}}}],
                as:"images"
                }},
                
                {$project:{status:{$cond:{if:{$ifNull:[{$size : "$images"} , 1]},then:" liked",else :"not liked"}}
                ,type:1,title:1,UserId:1,likeCount:1,commentCount:1}
                }
            
            ])
            //console.log(imageData)
        let videoData =  await postmodel.aggregate([
            {$match:{UserId:mongoose.Types.ObjectId(userid),type:'video'}},
            {$limit:5},
            {$lookup:{from:"postsactions",let:{userid:'$UserId',postid:'$_id'},
            pipeline:[{$match:{$expr:{$and:[{$eq:['$likes.UserId','$$userid']},{$eq:['$likes.PostId','$$postid']}]}}}],
            as:"videos"
            }},
            
            {$project:{status:{$cond:{if:{$ifNull:[{$size : "$videos"} , 1]},then:" liked",else :"not liked"}}
            ,type:1,title:1,UserId:1,likeCount:1,commentCount:1}
            }
            
            ])    
            //console.log(videoData)
        const [userDetails,imagesPost,videoPost] =await Promise.all([usersData,imageData,videoData])   
       //console.log(totalposts)
        res.json({
           UserDetails:userDetails,
           ImagesPosts:imagesPost,
           VideosPosts:videoPost
        })  



    },
    async postBytype(req,res){
        let result = req.params.type;
           let posts = await postmodel.aggregate([
                {$match:{type:result}},
                {$limit:10},
                {$lookup:{from:"postsactions",let:{userid:'$UserId',postid:'$_id'},
                    pipeline:[{$match:{$expr:{$and:[{$eq:['$likes.UserId','$$userid']},{$eq:['$likes.PostId','$$postid']}]}}}],
                    as:"videos"
                }},
            
                {$project:{status:{$cond:{if:{$ifNull:[{$size : "$videos"} , 1]},then:" liked",else :"not liked"}}
                ,type:1,title:1,UserId:1,likeCount:1,commentCount:1}
                }
            ])
           
        
            res.json({
                data:posts
            })
            //let result = await postmodel.find({type:req.params.type})
        // let posts = await  postmodel.aggregate([
        //         {$match:{type:result}},
        //         {$limit:10},
        //         {$lookup:{from:"postsactions",localField:"UserId",foreignField:"likes.UserId",as:"data"}},
        //         {$unwind:"$data"},
        //         {$project:{status:
        //             {$cond:{if:{$and : [{$eq  : ['$UserId','$data.likes.UserId'] },
        //             {$eq  : ['$_id','$data.likes.PostId'] } ] },
        //             then:"liked",else:"not liked"}},type:1,title:1,likeCount:1,commentCount:1}
        //         }
        //     ])
           // console.log(posts);

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
                   userid = decoded.id;
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
}
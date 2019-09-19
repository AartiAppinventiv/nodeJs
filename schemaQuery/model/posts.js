const mongoose = require('mongoose')

let postModel = new mongoose.Schema({
    type:{type:String,enum:['image','video'],required:true},
    title:{type:String,required:true},
    UserId:{
        type : mongoose.Schema.ObjectId ,
        ref : "Users"
    },
    likeCount:{type:Number},
    commentCount:{type:Number},
    reportCount:{type:Number}
})

let data = mongoose.model('Posts',postModel)
module.exports = data;
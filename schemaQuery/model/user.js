const mongoose = require('mongoose')

let userModel = new mongoose.Schema({
    fullName:{type:String,required:true},
    email:{type:String,required:true},
    password:{type:String,required:true},
    Image:{type:String},
    ImageCount:{type:Number},
    VideoCount:{type:Number}
})

let data = mongoose.model('Users',userModel)
module.exports = data;
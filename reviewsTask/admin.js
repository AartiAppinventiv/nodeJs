const mongoose = require('mongoose')
let AdminModel = new mongoose.Schema({
    name:{type: String,required: true},
    email:{type: String,required: true,unique:  true},
    password:{type:String,required: true},
    ProductId:[
        {
            type:mongoose.Schema.ObjectId,
            ref:"Product"
        }
    ],
    created:{type:Date, default:Date.now}
    
})
let data = mongoose.model('Admin',AdminModel)
//db.save().then(console.log(data))
module.exports = data;


const mongoose = require('mongoose')
let CustomerModel = new mongoose.Schema({
    name:{type: String,required: true},
    email:{type: String,required: true,unique:  true},
    password:{type:String,required: true},
    phone:{type:String},
    ProductId:[
        {
            type:mongoose.Schema.ObjectId,
            ref:"Product"
        }
    ],
    address:[
        {
            street: {type:String},
            city: {type:String},
            state: {type:String},

        }
    ],
    created:{type:Date, default:Date.now}
    
})
let data = mongoose.model('Customer',CustomerModel)
//db.save().then(console.log(data))
module.exports = data;


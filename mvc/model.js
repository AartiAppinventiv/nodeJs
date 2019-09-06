const mongoose = require('mongoose')
let UserModel = new mongoose.Schema({
    name:{type: String,required: true,unique: true},
    email:{type: String,required: true,unique:  true},
    password:{type:String,required: true},
    dob:{type:Date,required: true},
    image:{type:String,required: true}
})
let data = mongoose.model('Users',UserModel)

module.exports = data;
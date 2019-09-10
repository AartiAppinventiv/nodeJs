const mongoose = require('mongoose')

let ProductModel = new mongoose.Schema({
    name:{type: String,required:true},
    brand:{type:String},
    AdminId: [
          {
              type : mongoose.Schema.ObjectId ,
              ref : "Admin"
          }   
    ] ,
    type:{type:String,required:true},
    size:{type:String,required:true},
    price:{type:String,required:true},
    color:{type:String,required:true},
    created:{type:Date, default:Date.now}
   
})
let data = mongoose.model('Product',ProductModel)
//db.save().then(console.log(data))
module.exports = data;


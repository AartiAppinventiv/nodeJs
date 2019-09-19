const mongoose = require('mongoose')

let actionsModel = new mongoose.Schema({
   comment:{
       commentText:{type:String},
       likesCount:{type:String},
       UserId:{
            type : mongoose.Schema.Types.ObjectId 
       },
       PostId:{
        type : mongoose.Schema.Types.ObjectId 
       },
       created_at:{type:Date},
       updated_at:{type:Date}
    },
    likes:{
        UserId:{
            type : mongoose.Schema.Types.ObjectId 
        },
        PostId:{
            type : mongoose.Schema.Types.ObjectId 
        },
        created_at:{type:Date},
        updated_at:{type:Date}
    },
    reports:{
        UserId:{
            type : mongoose.Schema.Types.ObjectId 
        },
        PostId:{
            type : mongoose.Schema.Types.ObjectId 
        },
        reportMsg:{type:String},
        created_at:{type:Date},
        updated_at:{type:Date}
    }
    
})

let data = mongoose.model('PostsActions',actionsModel)
module.exports = data;
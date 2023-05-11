const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const groupSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    members:[
        {
            user:{
                type:mongoose.Schema.Types.ObjectId,
                required:true
            }
        }
    ]
},{timestamps:true})

const Group = mongoose.model('Group',groupSchema);
module.exports = Group;

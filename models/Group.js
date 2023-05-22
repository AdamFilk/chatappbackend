const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const groupSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    admins:[
        {
            type:mongoose.Schema.Types.ObjectId,
            required:true,
            ref:'User'
        }
    ],
    members:[
        {
            user:{
                type:mongoose.Schema.Types.ObjectId,
                required:true,
                ref:'User'
            }
        }
    ],
    is_private : {
        type : Boolean,
        required: true,
        default : false
    }
},{timestamps:true})

const Group = mongoose.model('Group',groupSchema);
module.exports = Group;

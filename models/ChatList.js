const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const chatListSchema = new Schema({
    user_id:{
        type: Schema.Types.ObjectId,
        required:true
    },
    chatList:[
        {
            chat:{
                type: Schema.Types.ObjectId,
                required:true,
                ref:'Chat'
            }
        }
    ]
},{timestamps:true});

const ChatList = mongoose.model('ChatList',chatListSchema);
module.exports = ChatList;
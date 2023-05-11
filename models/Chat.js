const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const chatSchema = new Schema({
    sender_id:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    },
    reciever_id:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    },
    group_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Group'
    },
    interest:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Interest'
    }
},{timestamps:true})

const Chat = mongoose.model('Chat',chatSchema);
module.exports = Chat;
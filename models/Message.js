const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const messageSchema = new Schema({
    content:{
        type: String,
        required:true,
    },
    type:{
        type: String,
        required:true,
    },
    chat_id:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'Chat'
    }
},
{timestamps:true})

const Message = mongoose.model('Message',messageSchema);

module.exports = Message;
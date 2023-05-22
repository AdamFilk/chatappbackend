const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const chatSchema = new Schema({
    sender_id:{
        type: mongoose.Schema.Types.ObjectId,
        required:is_required_normal(),
        ref:'User'
    },
    reciever_id:{
        type: mongoose.Schema.Types.ObjectId,
        required:is_required_normal(),
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

const is_required_normal = function(){
    if(!this.group_id && !this.interest){
        return true;
    }else{
        return false;
    }
}
module.exports = Chat;
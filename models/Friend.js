const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const friendSchema = new Schema({
    adder:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    },
    accepter:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    },
    accepted:{
        type: Boolean,
        required:true,
        default: false
    }
},{timestamps:true})

const Friend = mongoose.model('Friend',friendSchema);
module.exports = Friend;
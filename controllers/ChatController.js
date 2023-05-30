const ChatList = require("../models/ChatList");
const Message = require("../models/Message");

const getChatList = async (req,res) => {
    try{
        const user = req.user;
        if(req.body.group_id){
            const userChatList = await ChatList.findOne({user_id:user._id}).populate({
                path: 'chatList',
                model:'Chat',
                match: {group_id: req.body.group_id}
            }).exec();
            return res.status(200).send({
                result:1,
                data : userChatList 
             });
        }else if(req.body.interest_id){
            const userChatList = await ChatList.findOne({user_id:user._id}).populate({
                path: 'chatList',
                model:'Chat',
                match: {interest: req.body.interest_id}
            }).exec();
            return res.status(200).send({
                result:1,
                data : userChatList 
             });
        }else{
            const userChatList = await ChatList.findOne({user_id:user._id}).populate({
                path:'chatList',
                model:'Chat',
            }).exec();
            return res.status(200).send({
                result:1,
                data : userChatList 
             });
        }
    }catch(e){
        console.log(e);
        return res.status(400).send({
            result: 0,
            message:e.message
        });
    }
}

const chatMessages = async (req,res) => {
    try{
        const chat_id = req.body.chat_id;
        const messages = await Message.find({chat_id});
        return res.status(200).send({
           result:1,
           data : messages 
        });
    }catch(e){
        return res.status(400).send({
           result:0,
           message:e.message 
        });
    }
}

module.exports = {getChatList,chatMessages};
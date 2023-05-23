const ChatList = require("../models/ChatList");
const Message = require("../models/Message");

const chatList = async (req,res) => {
    try{
        const user = req.user;
        
        const query = await ChatList.findOne({user_id:user._id}).populate({
            path: 'chatList',
            model:'Chat'
        });
        if(req.body.group_id){
            query.populate({
                path: 'chatList',
                model:'Chat',
                match: {group_id: req.body.group_id}
            });
        }else if(req.body.interest_id){
            query.populate({
                path: 'chatList',
                model:'Chat',
                match: {interest: req.body.interest_id}
            });
        }
        const userChatList = query.exec();
        return res.status(200).send({
            result:1,
            data : userChatList 
         });
    }catch(e){
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

module.exports = {chatList,chatMessages};
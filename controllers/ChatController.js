const ChatList = require("../models/ChatList");
const Message = require("../models/Message");

const getChatList = async (req,res) => {
    try{
        const chatList = await ChatList.aggregate([
            {
                $match: {user_id:req.user._id},
            },
            {
                $limit:1
            },
            {
                $lookup : {
                    from: 'chats',
                    localField:'chatList',
                    foreignField:'_id',
                    as: 'chatList',
                    pipeline:[
                        {
                            $lookup :{
                                from: 'users',
                                localField:'sender_id',
                                foreignField:'_id',
                                as: 'sender',
                            }
                        },
                        {
                            $lookup :{
                                from: 'users',
                                localField:'reciever_id',
                                foreignField:'_id',
                                as: 'reciever',
                            }
                        },
                        {
                            $lookup :{
                                from: 'groups',
                                localField:'group_id',
                                foreignField:'_id',
                                as: 'group',
                            }
                        },
                        {
                            $lookup :{
                                from: 'interests',
                                localField:'interest',
                                foreignField:'_id',
                                as: 'interest',
                            }
                        },
                    ]
                }
            },
            // {$unwind: '$interest'},
            {
                $project :{
                    user_id:0
                }
            }
        ])
        return res.status(200).send({
            result:1,
            data : chatList[0]
        });
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
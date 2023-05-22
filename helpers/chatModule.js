const Chat = require("../models/Chat");
const ChatList = require("../models/ChatList");
const Group = require("../models/Group");

const normalChat = async (sender_id,reciever_id) => {
    const chat = await Chat.findOne({
        sender_id,
        reciever_id
    });
    if(!chat){
        chat = new Chat({
            sender_id,
            reciever_id
        })
        await chat.save();
    }
    await chatListAction(sender_id,chat._id);
    return chat;
}

const groupChat = async (group_id) => {
    const chat = await Chat.findOne({group_id});
    if(!chat){
        chat = new Chat({group_id});
        await chat.save();
    }
    const group = await Group.findOne({group_id});
    const groupMems = group.members;
    for(let a=0; a < groupMems.length; a++){
        await chatListAction(groupMems[a],chat._id);
    }
    return chat;
}

const interestChat = async (interest) =>{
    const chat = await Chat.findOne({interest});
    if(!chat){
        chat = new Chat({interest});
        await chat.save();
    }
    const interestedUsers = await User.find({
        interest: {
            $in : [interest]
        }
    });
    for(let a=0; a < interestedUsers.length; a++){
        await chatListAction(interestedUsers[a],chat._id);
    }
    return chat;
}

const chatListAction = async (sender_id,chat_id) => {
    const chatList = await ChatList.findOne({user_id:sender_id});
    if(!chatList){
        chatList = new ChatList({user_id:sender_id,chatList:[chat_id]});
        await chatList.save();
    }else{
        const chat_exists = chatList.chatList.filter(c => c === chat_id).length > 0;
        if(!chat_exists){
            chatList.chatList = chatList.chatList.concat(chat_id);
            await chatList.save();
        }else{
            await chatList.updateOne({_user_id:sender_id},{
                $currentDate: {
                    updated_at: true, // Update the 'updated_at' field to the current date and time
                  },
                  $set: {
                    // You can add other fields to update if needed
                    // For example: field1: value1, field2: value2
                  },
            });
        }
    }
}

module.exports = {normalChat,groupChat,interestChat};
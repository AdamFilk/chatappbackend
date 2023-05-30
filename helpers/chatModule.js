const Chat = require("../models/Chat");
const ChatList = require("../models/ChatList");
const Group = require("../models/Group");
const User = require("../models/User");

const normalChat = async (sender_id,reciever_id) => {
    const chat = await Chat.findOne({
        sender_id,
        reciever_id
    });
    if(!chat){
        const new_chat = new Chat({
            sender_id,
            reciever_id
        })
        await new_chat.save();
        await chatListAction(sender_id,new_chat._id);
        await chatListAction(reciever_id,new_chat._id);
        return new_chat;
    }
    await chatListAction(sender_id,chat._id);
    await chatListAction(reciever_id,chat._id);
    return chat;
}

const groupChat = async (group_id) => {
    const chat = await Chat.findOne({group_id});
    if(!chat){
        const new_chat = new Chat({group_id});
        await new_chat.save();
        const group = await Group.findOne({_id:group_id});
        const groupMems = group.members;
        for(let a=0; a < groupMems.length; a++){
            await chatListAction(groupMems[a],new_chat._id);
        }
        return new_chat;
    }
    const group = await Group.findOne({_id:group_id});
    const groupMems = group.members;
    for(let a=0; a < groupMems.length; a++){
        await chatListAction(groupMems[a],chat._id);
    }
    return chat;
}

const interestChat = async (interest) =>{
    const chat = await Chat.findOne({interest});
    if(!chat){
        const new_chat = new Chat({interest});
        await new_chat.save();
        const interestedUsers = await User.find({
            interest: {
                $in : interest
            }
        });
        for(let a=0; a < interestedUsers.length; a++){
            await chatListAction(interestedUsers[a],new_chat._id);
        }
        return new_chat;
    }else{
        const interestedUsers = await User.find({
            interest: {
                $in : interest
            }
        });
        for(let a=0; a < interestedUsers.length; a++){
            await chatListAction(interestedUsers[a],chat._id);
        }
        return chat;
    }
}

const chatListAction = async (user_id,chat_id) => {
    const chatList = await ChatList.findOne({user_id:user_id});
    if(!chatList){
        const new_chatList = new ChatList({user_id:user_id,chatList:[chat_id]});
        await new_chatList.save();
    }else{
        const chat_exists = chatList.chatList.filter(c => c === chat_id).length > 0;
        if(!chat_exists){
            chatList.chatList = chatList.chatList.concat(chat_id);
            await chatList.save();
        }else{
            await chatList.updateOne({_user_id:user_id},{
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
const User = require("../models/User");
const Message = require('../models/Message');
const {normalChat,groupChat,interestChat} = require('../helpers/chatModule');

module.exports = (io,socket) => {
    const addUserSocketID = () => {
        try{
            const user = socket.user
            user.socket_id = socket.id;
            user.is_active = true;
            user.save();
            socket.emit('message','Success!');
        }catch(err){
            console.log('Socket Err addUserSocketID:',err)
        }
    } 

    socket.on('user:update-socketid',addUserSocketID);

    const sendMessage =  async (payload) => {
        try{
            const user = socket.user;
            const sender_id = user._id;
            const reciever_id = payload.reciever_id;
            const reciever = await User.findOne({_id:reciever_id});
            const reciever_socket_id = reciever.socket_id;
            const chat = await normalChat(sender_id,reciever_id);
            const message = await new Message({
                content : payload.content,
                type : payload.type,
                chat_id : chat._id
            });
            io.to(reciever_socket_id).emit('message',message);
        }catch(e){
            console.log('Socket Err sendMessage: '+e);
        }
    }

    socket.on('user:send-message',sendMessage);

    const sendGroupMessage = async (payload) => {
        try{
            const chat = await groupChat(payload.group_id);
            const message = await new Message({
                content : payload.content,
                type : payload.type,
                chat_id : chat._id
            });
            io.broadcast.to(payload.group_id).emit('message',message);
        }catch(e){
            console.log('Socket Err sendGroupMessage: '+e)
        }
    }
    socket.on('user:send-group-message',sendGroupMessage);

    const sendInterestMessage = async (payload) => {
        try{
            const chat = await interestChat(payload.interest_id);
            const message = await new Message({
                content : payload.content,
                type : payload.type,
                chat_id : chat._id
            });
            io.broadcast.to(payload.interest_id).emit('message',message);
        }catch(e){
            console.log('Socket Err sendInterestMessage: '+e)
        }
    }
    socket.on('user:send-interest-message',sendInterestMessage);


    //on disconnect
    socket.on('disconnect', async () => {
        const user = socket.user;
        user.is_active = false;
        await user.save();
        // Perform any necessary actions upon disconnection
      });
}
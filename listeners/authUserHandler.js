const User = require("../models/User");
const Message = require('../models/Message');
const {normalChat,groupChat,interestChat} = require('../helpers/chatModule');

module.exports = (io,socket) => {
    // const addUserSocketID = () => {
    try{
        const user = socket.user;
        user.socket_id = socket.id;
        user.is_active = true;
        user.save();
    }catch(err){
        console.log('Socket Err addUserSocketID:',err);
    }
    // } 

    // socket.on('user:update-socketid',addUserSocketID);

    const sendMessage =  async (payload) => {
        try{
            // console.log(payload.reciever_id);
            if(!payload || !payload.content || !payload.type || !payload.reciever_id){
                return console.log('Provid all payload please');
            }
            const user = socket.user;
            const sender_id = user._id;
            const reciever_id = payload.reciever_id;
            const reciever = await User.findOne({_id:reciever_id});
            if(reciever){
                const reciever_socket_id = reciever.socket_id;
                const chat = await normalChat(sender_id,reciever_id);
                const message = await new Message({
                    content : payload.content,
                    type : payload.type,
                    chat_id : chat._id
                });
                message.save();
                if(reciever_socket_id){
                    // console.log(reciever_socket_id);
                    io.of('/users').to(reciever_socket_id).emit('user:message',message);
                }
            }else{
                sendErrMessage(user.socket_id,"Something went wrong");
            }
        }catch(e){
            console.log('Socket Err sendMessage: '+e);
        }
    }

    socket.on('user:send-message',sendMessage);

    const sendGroupMessage = async (payload) => {
        try{
            if(!payload || !payload.content || !payload.type || !payload.group_id){
                return console.log('Provid all payload please');
            }
            const chat = await groupChat(payload.group_id);
            const message = await new Message({
                content : payload.content,
                type : payload.type,
                chat_id : chat._id
            });
            message.save();
            socket.to(payload.group_id).emit('message',message);
        }catch(e){
            console.log('Socket Err sendGroupMessage: '+e)
        }
    }
    socket.on('user:send-group-message',sendGroupMessage);

    const sendInterestMessage = async (payload) => {
        try{
            if(!payload || !payload.content || !payload.type || !payload.interest_id){
                return console.log('Provid all payload please');
            }
            const chat = await interestChat(payload.interest_id);
            const message = await new Message({
                content : payload.content,
                type : payload.type,
                chat_id : chat._id
            });
            message.save();
            socket.to(payload.interest_id).emit('message',message);
        }catch(e){
            console.log('Socket Err sendInterestMessage: '+e)
        }
    }
    socket.on('user:send-interest-message',sendInterestMessage);

    const sendErrMessage = (socket_id,message) => {
        io.to(socket_id).emit(message);
    }

    //on disconnect
    socket.on('disconnect', async () => {
        const user = socket.user;
        user.is_active = false;
        await user.save();
        // Perform any necessary actions upon disconnection
      });
}
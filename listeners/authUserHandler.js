const User = require("../models/User");

module.exports = (io,socket) => {
    const addUserSocketID = () => {
        try{
            const user = socket.user
            user.socket_id = socket.id;
            user.save();
            socket.emit('message','Success!');
        }catch(err){
            console.log('Socket Err addUserSocketID:',err)
        }
    } 

    socket.on('user:update-socketid',addUserSocketID);
}
const User = require("../models/User");
const { authSocketUser } = require('../middlewares/authUser');

module.exports = (io,socket) => {
    const addUserSocketID = (payload) => {
        const user = socket.user
        user.socket_id = socket.id;
        user.save();
        socket.emit('message','Success!');
    } 
    socket.on('user:update-socketid',addUserSocketID);
}
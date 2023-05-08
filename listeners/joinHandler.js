module.exports = (io,socket) => {
    const sayHello = ( payload ) =>{
        socket.emit('message',payload);
    }

    socket.on('message',sayHello);
}
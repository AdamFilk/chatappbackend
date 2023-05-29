"use strict";
//start
require('dotenv').config();
const express = require("express");
const http = require('http');
const app = express();
const port = process.env.PORT || 3000;
const appSever = http.createServer(app);

//body parser
app.use(express.json());
//api routes
const userRouter = require("../routes/users");
const interestRouter = require("../routes/interests");
const friendRouter = require("../routes/friends");
const authRouter = require("../routes/auth");
const groupRouter = require('../routes/group');
const chatRouter = require('../routes/chat');


require("./db"); // mongodb connection

//routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/friends",friendRouter);
app.use("/api/v1/interests", interestRouter);
app.use('/api/v1/groups',groupRouter);
app.use('/api/v1/chat',chatRouter);

//socket stuff
const socketIO = require('socket.io');
const socketServer = http.createServer()
const io = socketIO(socketServer);
// const guestUserHandler = require('../listeners/guestUserHandler');
const { authSocketUser } = require('../middlewares/authUser');
const authUserHanlder = require('../listeners/authUserHandler');
const onConnection = (socket) => {  
  guestUserHandler(io, socket); //io from io  and socket from being on connection param
};

io.on("connection", onConnection);

const authUsersNamespace = io.of('/users');
authUsersNamespace.use(authSocketUser);
const onAuthConnection = (socket) => {
  authUserHanlder(io,socket);
}
authUsersNamespace.on('connection',onAuthConnection);

const socketPort = process.env.SOCKET_PORT || 4000;

appSever.listen(port, () => console.log(`Server is listening at port ${port}`)); //server port
socketServer.listen(socketPort,()=> console.log(`Socket is listening at port ${socketPort}`)) //socket port
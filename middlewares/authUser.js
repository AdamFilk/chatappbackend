const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authUser = async function(req,res,next){
    try{
        const token = req.header('Authorization').replace('Bearer ','');
        const decoded = jwt.decode(token,process.env.JWT_SECRET);
        const user = await User.findOne({
            _id: decoded,
            'tokens.token':token
        });
        if(!user){
            res.status(401).send({
                result:0,
                message:'Login again.'
            });
        }
        req.token = token;
        req.user = user;
        next();
    }catch(e){
        console.log(e.message);
        return res.status(401).send({
            result:0,
            message:'Please Login'
        });
    }
}

const authSocketUser = async function(socket,next){
    try{
        // console.log(socket.handshake);
        const bearerToken = socket.handshake.auth.token || socket.handshake.query.token;
        const token = bearerToken.replace('Bearer ','');
        const decoded = jwt.decode(token,process.env.JWT_SECRET);
        // console.log(decoded);
        const user = await User.findOne({
            _id: decoded,
            'tokens.token':token
        });
        if(!user){
            console.log('Socket Middleware Error: ','User not found')
        }
        socket.token = token;
        socket.user = user;
        next();
    }catch(e){
        console.log('Socket Middleware Error: ',e.message);
    }
}
module.exports = {authUser,authSocketUser};
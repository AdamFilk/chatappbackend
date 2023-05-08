const User = require('../models/User');

const login = async (req,res) => {
    try{
        const {email,password} = req.body;
        if(!email || !password || email.trim() == "" || password.trim() == ""){
            res.status(400).send({
                result:0,
                message: "Email and Password cannot be empty"
            });
        }
        const user = await User.findByCredential(email,password);
        const token = await user.createToken();
        res.status(200).send({
            result:1,
            data:{
                token,
                user
            }
        })
    }catch(e){
        res.status(400).send({
            result: 0,
            message: e.message
        });
    }
}

const logout = async(req,res) => {
    try{
        req.user.tokens = req.user.tokens.filter((token) => token.token !== req.token);
        await req.user.save();
        res.status(200).send({
            result:1,
            message:'Logged out'
        });
    }catch(e){
        res.status(400).send({
            result: 0,
            message: e.message
        });
    }
}

module.exports = {
    login,
    logout
}
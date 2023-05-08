const User = require('../models/User')

const createUser = async (req,res) => {
    const user = new User(req.body);
    try{
        await user.save();
        const token = await user.createToken();
        res.status(201).send({
            result: 1,
            message:"Success!",
            data: {
                token,
                user: user
            }
        });
    }catch(e){
        res.status(400).send({
            result:0,
            message: e.message
        });
    }
}

const getUsers = async (req,res) => {
    try{
        const users = await User.find().populate({
            path: "interests",
            model: "Interest"
        }).exec();
        res.status(200).send({
            result:1,
            data: users
        });
    }catch(e){
        res.status(400).send(e.message);
    }
}

const showUser = async (req,res) => {
    try{
        const user = await User.findOne({_id:req.params.id}).populate({
            path: 'interests',
            model:'Interest'
        }).exec();
        if(!user){
            res.status(404).send({
                result:0,
                message:'Sorry user not found'
            });
        }
        res.status(200).send({
            result: 1,
            data: user
        });
    }catch(e){
        res.status(400).send(e);
    }
} 

const updateUser = async (req,res) => {
    try{
        const _id = req.params.id;
        const updates = Object.keys(req.body);
        const allowedUpdateds = ["description", "completed"];
        const isValidUpdates = updates.every((update) => 
          allowedUpdateds.includes(update)
        );
        if (!isValidUpdates) {
          return res.status(400).send({ error: "Invalid Update Keys" });
        }
        const user = await User.findOne({_id});
        if(!user){
            res.status(404).send({
                result:0,
                message:'Sorry user not found'
            });
        }
        updates.forEach(update => {
            user[update] = req.body[update];
        })
        user.save()
        res.status(200).send({
           result:1,
           data: user,
           message: 'Successfully updated user info!'
        });
    }catch(e){
        res.status(400).send(e);
    }
}

const deleteUser = async (req,res) => {
    try{
        const user = await User.findOneAndDelete({
            _id : req.params.id
        });
        if (!user) {
            return res.status(404).send({
                result: 0,
                message: 'Sorry user not found.'
            });
        }
        res.status(200).send({
            result: 1,
            message: 'Deleted'
        });
    }catch(e){
        res.status(400).send(e);
    }
}

module.exports = {
    createUser,
    getUsers,
    showUser,
    updateUser,
    deleteUser
}
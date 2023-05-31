const { default: mongoose } = require('mongoose');
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
        const users = await User.findOne({_id:req.user._id}).populate({
            path: 'interests',
            model:'Interest'
        }).exec();
        if(!users){
            res.status(404).send({
                result:0,
                message:'Sorry user not found'
            });
        }
        res.status(200).send({
            result: 1,
            data: users
        });
    }catch(e){
        res.status(400).send(e);
    }
} 

const updateUser = async (req,res) => {
    try{
        const updates = Object.keys(req.body);
        const allowedUpdateds = ["name", "email"];
        const isValidUpdates = updates.every((update) => 
          allowedUpdateds.includes(update)
        );
        if (!isValidUpdates) {
          return res.status(400).send({ error: "Invalid Update Keys" });
        }
        const user = req.user;
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
        const user = req.user;
        // console.log(user);
        await User.deleteOne({_id:user._id});
        res.status(200).send({
            result: 1,
            message: 'Deleted'
        });
    }catch(e){
        return res.status(400).send({
            result:0,
            message : e.message
        });
    }
}

const userInterestManage = async (req,res) => {
    try{
        const user = req.user;
        const addInterest = req.body.add_interests;
        const removeInterest = req.body.remove_interests;
        if(addInterest.length > 0){
            if(user.interests.length > 0){
                user.interests = user.interests.concat(addInterest);
            }else{
                user.interests = addInterest;
            }
        }
        if(removeInterest.length > 0){
            if(user.interests.length > 0){
                // removeInterest.forEach(rmi => {
                //     user.interests = user.interests.filter(i => {
                //         console.log(i,new mongoose.Types.ObjectId(rmi))
                //         return i !==  new mongoose.Types.ObjectId(rmi)
                //     });
                // })
                user.interests = user.interests.filter(interest => {
                    return !removeInterest.includes(interest.toString())
                });
            }else{
                console.log(`Ain't nothing to remove bro.`)
            }
        }
        await user.save();
        return res.status(200).send({
            result:1,
            data : user
        });
    }catch(e){
        return res.status(400).send({
            result:0,
            message : e.message
        })
    }
}

module.exports = {
    createUser,
    getUsers,
    showUser,
    updateUser,
    deleteUser,
    userInterestManage
}
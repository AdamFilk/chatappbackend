const { default: mongoose } = require("mongoose");
const Group = require("../models/Group");

const createGroup = async (req,res) => {
    try{
        const group = new Group({
            name : req.body.name,
            admins : [req.user._id],
            members : [req.user._id],
            is_private : req.body.is_private
        });
        await group.save();
    }catch(e){
        return res.status(400).send({
            'result': 0,
            'message': e.message
        });  
    }
}

const joinGroup = async (req,res) => {
    try{
        const group = await Group.findOne({_id:req.body.group_id});
        const user = req.user;
        group.members = group.members.concat(user._id);
        await group.save();
        return res.status(200).send({
            'result':1,
            'message': 'Joined Group Successfully!'
        });
    }catch(e){
        return res.status(400).send({
            'result': 0,
            'message': e.message
        });  
    }
}

const deleteGroup = async (req,res) => {
    try{
        const user = req.user;
        const is_admin = await Group.findOne({
            _id:req.body.group_id,
            admins:{
                $in : user._id
            }
        });
        if(!is_admin){
            return res.status(400).send({
                'result': 0,
                'message': 'Sorry, you are not an admin'
            });
        }

        await Group.deleteOne({_id:req.body.group_id});

        return res.status(200).send({
            'result':1,
            'message': 'Deleted Group Successfully!'
        });
    }catch(e){
        return res.status(400).send({
            'result': 0,
            'message': e.message
        });  
    }
}

const renameGroup = async (req,res)=> {
    try{
        const user = req.user;
        const is_admin = await Group.findOne({
            _id:req.body.group_id,
            admins:{
                $in : user._id
            }
        });
        if(!is_admin){
            return res.status(400).send({
                'result': 0,
                'message': 'Sorry, you are not an admin'
            });
        }
        const group = await Group.findOne({_id:req.body.group_id});
        group.name = req.body.name;
        await group.save();
        return res.status(200).send({
            'result':1,
            'message': 'Renamed Group Successfully!'
        });
    }catch(e){
        return res.status(400).send({
            'result': 0,
            'message': e.message
        });  
    }
}

const kickFromGroup = async (req,res) => {
    try{
        const user = req.user;
        const is_admin = await Group.findOne({
            _id:req.body.group_id,
            admins:{
                $in : user._id
            }
        });
        if(!is_admin){
            return res.status(400).send({
                'result': 0,
                'message': 'Sorry, you are not an admin'
            });
        }
        const group = await Group.findOne({_id:req.body.group_id});
        group.members = group.members.filter(gm => gm !== mongoose.Types.ObjectId(req.body.member_id));
        await group.save();
        return res.status(200).send({
            'result':1,
            'message': 'Kicked from Group Successfully!'
        });
    }catch(e){
        return res.status(400).send({
            'result': 0,
            'message': e.message
        });  
    }
}

const togglePrivacy = async (req,res) => {
    try{
        const user = req.user;
        const is_admin = await Group.findOne({
            _id:req.body.group_id,
            admins:{
                $in : user._id
            }
        });
        if(!is_admin){
            return res.status(400).send({
                'result': 0,
                'message': 'Sorry, you are not an admin'
            });
        }
        const group = await Group.findOne({_id:req.body.group_id});
        group.is_private = req.body.is_private;
        await group.save();
        return res.status(200).send({
            'result':1,
            'message': 'Changed Group Privacy Successfully!'
        });
    }catch(e){
        return res.status(400).send({
            'result': 0,
            'message': e.message
        });  
    }
}

const giveAdminRole = async (req,res) => {
    try{
        const user = req.user;
        const is_admin = await Group.findOne({
            _id:req.body.group_id,
            admins:{
                $in : user._id
            }
        });
        if(!is_admin){
            return res.status(400).send({
                'result': 0,
                'message': 'Sorry, you are not an admin'
            });
        }
        const group = await Group.findOne({_id:req.body.group_id});
        group.admins = group.admins.concat(req.body.member_id);
        await group.save();
        return res.status(200).send({
            'result':1,
            'message': 'Gave admin successfully!'
        });
    }catch(e){
        return res.status(400).send({
            'result': 0,
            'message': e.message
        });  
    }
}

module.exports = {
    createGroup,
    joinGroup,
    deleteGroup,
    renameGroup,
    kickFromGroup,
    togglePrivacy
}
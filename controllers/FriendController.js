const Friend = require('../models/Friend');

const addFriend = async (req,res) => {
    try{
        const adder = req.user._id;
        const accepter = req.body.accepter;
        const friend = new Friend({
            adder,accepter
        })
        await friend.save();
        res.status(200).send({
            result:1,
            message:'Friend Request Sent Successfully.'
        })
    }catch(e){
        res.status(400).send({
            result:0,
            message:e.message
        });
    }
}

const acceptFriendReq = async (req,res) => {
    try{
        const friend_req_id = req.body.friend_req_id;
        if(!is_accepter(req.user._id,friend_req_id)){
            return res.status(400).send({
                result:0,
                message: 'User is not suppose to accept or reject.'
            })
        }
        const friend_req = await Friend.findOne({
            _id : friend_req_id
        });
        if(!friend_req){
            return res.status(404).send({
                result:0,
                message:'Friend request not found'
            });
        }
        friend_req.accepted = true;
        await friend_req.save();
        res.send({
            result: 1,
            message: 'You guys are now friends.'
        });
    }catch(e){
        res.status(400).send({
            result:0,
            message: e.message
        })
    }
}

const rejectFriendReq = async (req,res) => {
    try{
        const friend_req_id = req.body.friend_req_id;
        if(!is_accepter(req.user._id,friend_req_id)){
            return res.status(400).send({
                result:0,
                message: 'User is not suppose to accept or reject.'
            })
        }
        const friend_req = await Friend.findOne({
            _id : friend_req_id
        });
        if(!friend_req){
            return res.status(404).send({
                result:0,
                message:'Friend request not found'
            });
        }
        friend_req.accepted = false;
        await friend_req.save();
        return res.status(404).send({
            result:0,
            message:'You have rejected successfully.'
        });
    }catch(e){
        res.status(400).send({
            result:0,
            message: e.message
        })
    }
}

const cancelFriendReq = async (req,res) => {
    try{
        const friend_req_id = req.body.friend_req_id;
        if(!is_adder(req.user._id,friend_req_id)){
            return res.status(400).send({
                result:0,
                message: 'User is not suppose to cancel.'
            })
        }
        const friend_req = await Friend.findOne({
            _id : friend_req_id
        });
        if(!friend_req){
            return res.status(404).send({
                result:0,
                message:'Friend request not found'
            });
        }
        await Friend.deleteOne({_id:friend_req._id});
        return res.status(404).send({
            result:0,
            message:'You have canceled successfully.'
        });
    }catch(e){
        res.status(400).send({
            result:0,
            message: e.message
        })
    }
}

const showlist = async (req,res) => {
    try{
        const friendReqs = await Friend.find({
            accepter: req.user._id
        }).populate('adder');
        res.send({
            result:1,
            friend_reqs: friendReqs
        })
    }catch(e){
        res.send({
            result:0,
            message:e.message
        })
    }
}

const is_adder = async  (user_id,friend_req_id) => {
    const friend_req= await Friend.findOne({_id:friend_req_id});
    if(user_id === friend_req.adder){
        return true;
    }else{
        return false;
    }
}

const is_accepter = async  (user_id,friend_req_id) => {

    const friend_req= await Friend.findOne({_id:friend_req_id});

    if(user_id === friend_req.accepter){
        return true;
    }else{
        return false;
    }
}

module.exports = {
    addFriend,
    acceptFriendReq,
    rejectFriendReq,
    cancelFriendReq,
    showlist
}
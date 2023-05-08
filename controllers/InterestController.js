const Interest = require('../models/Interest');

const createInterest = async (req,res) => {
    try{
        const interest = await new Interest(req.body);
        interest.save();
        res.status(200).send({
            result: 1,
            message:'Success',
            data: interest
        });
    }catch(e){
        res.status(400).send(e);
    }
}

const getInterests =  async (req,res) => {
    try{
        const interests = await Interest.find();
        res.status(200).send({
            result : 1,
            data: interests
        });
    }catch(e){
        res.status(400).send(e);
    }
}

const showInterest = async (req,res) => {
    try{
        const interest = await Interest.findOne({_id:req.params.id});
        if(!interest){
            return res.status(404).send({
                result:0,
                message:`Sorry, can't find any interest.`
            });
        }
        res.status(200).send({
            result:1,
            data:interest
        });
    }catch(e){
        res.status(400).send(e);
    }
} 

const updateInterest = async (req,res) => {
    try{
        const updates = Object.keys(req.body);
        const allowedUpdateds = ["name"];
        const isValidUpdates = updates.every((update) =>
          allowedUpdateds.includes(update)
        );
        console.log(updates);
        if (!isValidUpdates || updates.length === 0) {
          return res.status(400).send({ error: "Invalid Update Keys" });
        }
        const interest = await Interest.findById(req.params.id);
        if(!interest){
            return res.status(404).send({
                result:0,
                message:`Sorry, can't find any interest.`
            });
        }
        interest.name = req.body.name;
        interest.save();
        res.status(200).send({
           result:1,
           data:interest 
        });
    }catch(e){
        res.status(400).send(e);
    }
}

const deleteInterest = async (req,res) => {
    try{
        const interest = await Interest.findOneAndDelete({_id:req.params.id});
        if(!interest){
            return res.status(404).send({
                result:0,
                message:`Sorry, can't find any interest.`
            });
        }
        res.status(200).send({
            result:1,
            message:'Deleted successfully!'
        })
    }catch(e){
        res.status(400).send(e);
    }
}

module.exports = {
    createInterest,
    getInterests,
    showInterest,
    updateInterest,
    deleteInterest
}
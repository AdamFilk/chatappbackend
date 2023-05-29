const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const groupSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    admins:[
        {
            type:mongoose.Schema.Types.ObjectId,
            required:true,
            ref:'User'
        }
    ],
    members:[
        {
            type:mongoose.Schema.Types.ObjectId,
            required:true,
            ref:'User'
        }
    ],
    is_private : {
        type : Boolean,
        required: true,
        default : false
    }
},{timestamps:true})

//how to aggregate hide nested object 
groupSchema.pre('aggregate',function(next){
    const projectStage = {
        $project: {
            password: 0,
            tokens:0,
        }
    };
    const pipeline = this.pipeline();
    pipeline.forEach(stage => {
      if (stage.$lookup) {
        const lookupStage = stage.$lookup;
        if(lookupStage.from == 'users'){
            lookupStage.pipeline.push(projectStage);
        }
      }
    });
    next();
});

const Group = mongoose.model('Group',groupSchema);
module.exports = Group;

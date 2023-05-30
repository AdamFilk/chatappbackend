const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const chatListSchema = new Schema({
    user_id:{
        type: Schema.Types.ObjectId,
        required:true,
        ref:'User'
    },
    chatList:[
        {
            type: Schema.Types.ObjectId,
            required:true,
            ref:'Chat'
        }
    ]
},{timestamps:true});

chatListSchema.pre('aggregate',function(next){
    const projectStage = {
        $project: {
            password: 0,
            tokens:0,
            socket_id:0
        }
    };
    const pipeline = this.pipeline();
    pipeline.forEach(stage => {
      if (stage.$lookup) {
        const lookupStage = stage.$lookup;
        if(lookupStage.from == 'users'){
            lookupStage.pipeline = [projectStage];
        }
        if(lookupStage.from == 'chats'){
            lookupStage.pipeline.forEach(ls => {
                if(ls.$lookup.from == 'users'){
                    ls.$lookup.pipeline = [projectStage]
                }
            })
        }
      }
    });
    next();
});

const ChatList = mongoose.model('ChatList',chatListSchema);
module.exports = ChatList;
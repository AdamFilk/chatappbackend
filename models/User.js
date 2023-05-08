const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name:{
        type: String,
        required:true,
        trim:true,
    },
    email:{
        type:String,
        required:true,
        trim:true
    },
    password:{
        type:String,
        required:true,
        trim:true,
        validate(value){
            if(value.length <= 5){
                throw new Error("Password Must be at least 6 characters");
            }
        }
    },
    age:{
        type:Number,
        required:true
    },
    interests:[
        {
            type : mongoose.Schema.Types.ObjectId,
            ref:'Interest'
        }
    ],
    tokens: [
        {
          token: {
            type: String,
            required: true,
          },
          expiresAt:{
            type: Date,
            required: true
          }
        },
    ],
    socket_id:{
        type: String,
    }
},{timestamps:true});
UserSchema.methods.toJSON = function(){
    const user = this;
    const userObj = user.toObject();
    delete userObj.password;
    delete userObj.tokens;   
    return userObj;
}

UserSchema.methods.createToken = async function() {
    const user = this;
    const expiresIn = 60 * 60;
    const token = await jwt.sign({_id:user._id.toString()},process.env.JWT_SECRET,{expiresIn});
    const now = new Date();
    const expiresAt = new Date(now.getTime() + expiresIn * 1000);
    user.tokens = user.tokens.concat({token,expiresAt});
    await user.save();
    return token;
}

UserSchema.statics.findByCredential = async function(email,password){
    const user = await this.findOne({email});
    if(!user){
        throw new Error('Unable to find user with this email');
    }
    const isValid = await bcrypt.compare(password,user.password);
    if(!isValid){
        throw new Error('Password Invalid');
    }
    return user;
}

UserSchema.pre('save',async function(next){
    const user = this;
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password,8);
    }
    next();
});

const User = mongoose.model("User",UserSchema);

module.exports = User;
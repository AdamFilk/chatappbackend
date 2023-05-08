const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/chatapp')
        .then(()=>console.log('Connected to Mongo!'))
        .catch((err)=> console.log(err));
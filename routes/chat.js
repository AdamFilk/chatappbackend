const express = require('express');
const router = express.Router();
const {authUser} = require('../middlewares/authUser');
const {
    getChatList,
    chatMessages
} = require('../controllers/ChatController');

router.post('/list',authUser,getChatList);
router.post('/messages',authUser,chatMessages);
      
module.exports = router;
const express = require('express');
const router = express.Router();
const {authUser} = require('../middlewares/authUser');
const {
    chatList,
    chatMessages
} = require('../controllers/ChatController');

router.post('/list',authUser,chatList);
router.post('/messages',authUser,chatMessages);
      
module.exports = router;
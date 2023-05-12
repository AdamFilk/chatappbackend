const express = require('express');
const router = express.Router();
const {authUser} = require('../middlewares/authUser');
const {
    addFriend,
    acceptFriendReq,
    cancelFriendReq,
    rejectFriendReq,
    showlist
} = require('../controllers/FriendController');

router.post('/add',authUser,addFriend)
router.patch('/accept',authUser,acceptFriendReq)
router.patch('/reject',authUser,rejectFriendReq)
router.delete('/cancel',authUser,cancelFriendReq)
router.get('/list',authUser,showlist)
      
module.exports = router;
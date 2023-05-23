const express = require('express');
const router = express.Router();
const {authUser} = require('../middlewares/authUser');
const {
createGroup,
joinGroup,
renameGroup,
deleteGroup,
kickFromGroup,
togglePrivacy,
giveAdminRole,
groupList,
getGroupInfo
} = require('../controllers/GroupController');

router.get('/',groupList);
router.get('/get-group-info',getGroupInfo);
router.post('/',authUser,createGroup);
router.post('/join',authUser,joinGroup);
router.post('/rename',authUser,renameGroup);
router.delete('/',authUser,deleteGroup);
router.post('/kick',authUser,kickFromGroup);
router.post('/toggle-privacy',authUser,togglePrivacy);
router.post('/give-admin-role',authUser,giveAdminRole);
     
module.exports = router;
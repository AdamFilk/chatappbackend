const express = require('express');
const router = express.Router();
const {authUser} = require('../middlewares/authUser');
const {
createGroup,
joinGroup,
renameGroup,
deleteGroup,
kickFromGroup,
togglePrivacy
} = require('../controllers/GroupController');

     
module.exports = router;
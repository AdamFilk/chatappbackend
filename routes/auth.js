const express = require('express');
const router = express.Router();

const {
    login,
    logout
} = require('../controllers/AuthController');
const { authUser } = require('../middlewares/authUser');

router.post('/login',login);
router.post('/logout',authUser,logout);

module.exports = router;
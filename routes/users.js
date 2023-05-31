const express = require('express');
const router = express.Router();
const {authUser} = require('../middlewares/authUser');
const {
    getUsers,
    createUser,
    updateUser,
    showUser,
    deleteUser,
    userInterestManage
} = require('../controllers/UserController');

router.route('/')
      .get(getUsers)
      .post(createUser)
router.route('/actions')
      .get(authUser,showUser)
      .patch(authUser,updateUser)
      .delete(authUser,deleteUser)
router.route('/user-interest-manage')
      .post(authUser,userInterestManage)

module.exports = router;
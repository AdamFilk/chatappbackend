const express = require('express');
const router = express.Router();
const {authUser} = require('../middlewares/authUser');
const {
    getUsers,
    createUser,
    updateUser,
    showUser,
    deleteUser
} = require('../controllers/UserController');

router.route('/')
      .get(getUsers)
      .post(createUser)
router.route('/:id')
      .get(authUser,showUser)
      .patch(updateUser)
      .delete(deleteUser)

module.exports = router;
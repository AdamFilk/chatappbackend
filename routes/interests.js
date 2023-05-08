const express = require('express');
const router = express.Router();
const {
    getInterests,
    createInterest,
    updateInterest,
    showInterest,
    deleteInterest
} = require('../controllers/InterestController');

router.route('/')
      .get(getInterests)
      .post(createInterest)
router.route('/:id')
      .get(showInterest)
      .patch(updateInterest)
      .delete(deleteInterest)

module.exports = router;
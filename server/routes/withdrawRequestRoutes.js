const router = require('express').Router();
const User = require('../models/userModel');
const { protect } = require('../middlewares/protect');
const { createWithdrawRequest, getAllWithdrawRequests, getMyWithdrawRequests, updateWithdrawRequest, getSingleWithdrawRequest } = require('../controllers/withdrawRequestController');

router.route('/my')
    .get(protect(User) , getMyWithdrawRequests)

router.route('/')
    .post(protect(User) , createWithdrawRequest)
    .get(getAllWithdrawRequests)


router.route('/:id')
    .put(updateWithdrawRequest)
    .get(getSingleWithdrawRequest)

module.exports = router;
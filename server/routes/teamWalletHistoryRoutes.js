const router = require('express').Router();
const { getAllTeamWalletHistories, getMyTeamWalletHistories, getSingleUserTeamWalletHistories } = require('../controllers/teamWalletHistoryController');
const { protect } = require('../middlewares/protect');
const Admin = require('../models/adminModel');
const User = require('../models/userModel');

router.route('/')
    .get(getAllTeamWalletHistories)

router.route('/my')
    .get(protect(User) , getMyTeamWalletHistories)

router.get('/user/:id' , protect(Admin) , getSingleUserTeamWalletHistories);


module.exports = router;